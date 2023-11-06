import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { IPost } from '../models/IPost';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  public getPosts(): Observable<IPost[]> {
    return this.http
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
        })
      );
  }

  public getPostsWithCategory(): Observable<
    {
      categoryName: string | undefined;
      id?: string | undefined;
      title: string;
      categoryId: string;
      description: string;
    }[]
  > {
    return this.getPosts().pipe(
      mergeMap((posts) => {
        return this.categoryService.getCategories().pipe(
          map((categories) => {
            return posts.map((post) => {
              return {
                ...post,
                categoryName: categories.find(
                  (category) => category.id === post.categoryId
                )?.title,
              };
            });
          })
        );
      })
    );
  }

  public addPost(post: IPost): Observable<{
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
        map((response) => {
          return { ...post, id: response.name };
        })
      );
  }
}
