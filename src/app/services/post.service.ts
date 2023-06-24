import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost';
import { Subscription, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  posts: IPost[] = [];
  postsSubscription!: Subscription;
  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<{ [id: string]: IPost }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`
    ).pipe(map((posts) => {
      let postData: IPost[] = [];

      for (let id in posts) {
        postData.push({...posts[id], id});
      }

      return postData;
    }));
  }
}
