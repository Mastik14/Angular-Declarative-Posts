import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
  Subject,
  catchError,
  throwError,
  shareReplay,
  scan,
  tap,
  BehaviorSubject,
  merge,
  concatMap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { CRUDAction, IPost } from '../models/IPost';
import { DeclarativeCategoryService } from './DeclarativeCategory.service';
import { NotificationService } from './Notification.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService,
    private notificationService: NotificationService
  ) {}

  posts$ = this.http
    .get<{ [id: string]: IPost }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`
    )
    .pipe(
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      catchError(this.handleError),
      shareReplay(1)
    );

  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    }),
    shareReplay(1),
    catchError(this.handleError)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  private postCRUDCompleteSubject = new Subject<boolean>();
  postCRUDCompleteAction$ = this.postCRUDCompleteSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPosts(posts, value);
    }, [] as IPost[]),
    shareReplay(1),
    catchError(this.handleError)
  );

  public modifyPosts(
    posts: IPost[],
    value: IPost[] | CRUDAction<IPost>
  ): IPost[] {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }
      if (value.action === 'update') {
        return posts.map((post) =>
          post.id === value.data.id ? value.data : post
        );
      }

      if (value.action === 'delete') {
        return posts.filter((post) => post.id !== value.data.id);
      }
    } else {
      return value;
    }

    return posts;
  }

  public savePosts(postAction: CRUDAction<IPost>): Observable<IPost> {
    let postDetails$!: Observable<IPost>;

    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage('Post Added Successfully');
          this.postCRUDCompleteSubject.next(true);
        }),
        catchError(this.handleError)
      );
    }

    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage(
            'Post Updated Successfully'
          );
          this.postCRUDCompleteSubject.next(true);
        }),
        catchError(this.handleError)
      );
    }

    if (postAction.action === 'delete') {
      return this.deletePostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage(
            'Post Deleted Successfully'
          );
          this.postCRUDCompleteSubject.next(true);
        }),
        map(() => postAction.data),
        catchError(this.handleError)
      );
    }

    return postDetails$.pipe(
      concatMap((post) =>
        this.categoryService.categories$.pipe(
          map((categories) => {
            return {
              ...post,
              categoryName: categories.find(
                (category) => category.id === post.categoryId
              )?.title,
            };
          })
        )
      )
    );
  }

  public deletePostToServer(post: IPost): Observable<Object> {
    return this.http.delete(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`
    );
  }

  public updatePostToServer(post: IPost): Observable<IPost> {
    return this.http.patch<IPost>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`,
      post
    );
  }

  public addPostToServer(post: IPost): Observable<{
    id: string;
    title: string;
    categoryId: string;
    description: string;
    categoryName?: string | undefined;
  }> {
    return this.http
      .post<{ name: string }>(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`,
        post
      )
      .pipe(
        map((id) => {
          return {
            ...post,
            id: id.name,
          };
        })
      );
  }

  public addPost(post: IPost): void {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  public updatePost(post: IPost): void {
    this.postCRUDSubject.next({ action: 'update', data: post });
  }

  public deletePost(post: IPost): void {
    this.postCRUDSubject.next({ action: 'delete', data: post });
  }

  private selectedPostSubject = new BehaviorSubject<string>('');
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([this.allPosts$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),

    catchError(this.handleError)
  );

  public selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  public handleError() {
    return throwError(() => {
      return 'unknown error occurred. Please try again';
    });
  }
}
