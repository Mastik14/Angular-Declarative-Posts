import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';
import { LoaderService } from 'src/app/services/Loader.service';

@Component({
  selector: 'app-declarative-posts',
  templateUrl: './declarative-posts.component.html',
  styleUrls: ['./declarative-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePostsComponent implements OnInit {
  constructor(
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService,
    private loaderService: LoaderService
  ) {}

  posts$ = this.postService.allPosts$;
  categories$ = this.categoryService.categories$;

  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

  filteredPosts$ = combineLatest([
    this.posts$,
    this.selectedCategoryAction$,
  ]).pipe(
    tap(() => {
      this.loaderService.hideLoader();
    }),
    map(([posts, selectedCategory]) => {
      return posts.filter((post) =>
        selectedCategory ? post.categoryId === selectedCategory : true
      );
    })
  );

  public ngOnInit(): void {
    this.loaderService.showLoader();
  }

  public onCategoryChange(event: Event): void {
    let selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategorySubject.next(selectedCategoryId);
  }
}
