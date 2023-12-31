import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '../models/ICategory';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeclarativeCategoryService {
  constructor(private http: HttpClient) {}

  categories$ = this.http
    .get<{ [id: string]: ICategory }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/categories.json`
    )
    .pipe(
      map((categories) => {
        let categoriesData: ICategory[] = [];
        for (let id in categories) {
          categoriesData.push({ ...categories[id], id });
        }
        return categoriesData;
      }),
      shareReplay()
    );
}
