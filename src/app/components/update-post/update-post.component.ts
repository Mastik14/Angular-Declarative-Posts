import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  constructor(
    private categoryService: DeclarativeCategoryService,
    private postService: DeclarativePostService
  ) {}

  postId: string = '';
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });
  categories$ = this.categoryService.categories$;

  post$ = this.postService.post$.pipe(
    tap((post) => {
      if (post) {
        this.postId = post?.id + '';
        this.postForm.setValue({
          title: post?.title,
          description: post?.description,
          categoryId: post?.categoryId,
        });
      }
    })
  );

  public onUpdatePost(): void {
    let postDetails = {
      ...this.postForm.value,
      id: this.postId,
    };

    this.postService.updatePost(postDetails as IPost);
  }
}
