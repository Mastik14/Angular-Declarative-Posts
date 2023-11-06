import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  postsSubscription!: Subscription;
  intervalSubscription!: Subscription;

  constructor(private postService: PostService) {}

  public ngOnInit(): void {
    this.getPosts();
  }

  public getPosts(): void {
    this.intervalSubscription = interval(1000).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete interval');
      },
    });

    this.postsSubscription = this.postService.getPostsWithCategory().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete http call');
      },
    });
  }

  public ngOnDestroy(): void {
    this.postsSubscription && this.postsSubscription.unsubscribe();
    this.intervalSubscription && this.intervalSubscription.unsubscribe();
  }
}
