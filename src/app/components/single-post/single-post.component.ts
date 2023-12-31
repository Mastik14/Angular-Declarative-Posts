import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  constructor(private postService: DeclarativePostService) {}

  showUpdatePost = false;
  errorMessageSubject = new BehaviorSubject<string>('');
  errorMessageAction$ = this.errorMessageSubject.asObservable();
  errorMessage = '';
  post$ = this.postService.post$.pipe(
    tap((post) => {
      this.showUpdatePost = false;
    }),
    catchError((error: string) => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    })
  );

  public onUpdatePost(): void {
    this.showUpdatePost = true;
  }

  public onDeletePost(post: IPost): void {
    if (confirm('R you sure you want to delete?')) {
      this.postService.deletePost(post);
    }
  }
}
