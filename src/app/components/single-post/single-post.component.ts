import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SinglePostComponent implements OnInit {
  post$ = this.postService.post$;
  constructor(private postService: DeclarativePostService) {}

  ngOnInit(): void {}
}
