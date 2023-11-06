import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new Subject<boolean>();
  loadingAction$ = this.loadingSubject.asObservable();

  public showLoader(): void {
    this.loadingSubject.next(true);
  }

  public hideLoader(): void {
    this.loadingSubject.next(false);
  }
}
