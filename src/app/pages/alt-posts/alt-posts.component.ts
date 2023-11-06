import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-alt-posts',
  templateUrl: './alt-posts.component.html',
  styleUrls: ['./alt-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AltPostsComponent {
  constructor(private postService: DeclarativePostService) {}

  showAddPost = false;

  selectedPost$ = this.postService.post$.pipe(
    tap((data) => {
      console.log('firing selected post');
    })
  );
  posts$ = this.postService.allPosts$.pipe(
    tap((posts) => {
      posts[0].id && this.postService.selectPost(posts[0].id);
    })
  );

  vm$ = combineLatest([this.posts$, this.selectedPost$]).pipe(
    map(([posts, selectedPost]) => {
      return { posts, selectedPost };
    })
  );

  public onSelectPost(post: IPost, event: Event): void {
    event.preventDefault();
    this.showAddPost = false;
    post.id && this.postService.selectPost(post.id);
  }

  public onAddPost(): void {
    this.showAddPost = true;
  }
}
