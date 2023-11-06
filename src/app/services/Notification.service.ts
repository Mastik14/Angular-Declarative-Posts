import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private successMessageSubject = new Subject<string>();
  successMessageAction$ = this.successMessageSubject.asObservable();

  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  public setSuccessMessage(message: string): void {
    this.successMessageSubject.next(message);
  }

  public setErrorMessage(message: string): void {
    this.errorMessageSubject.next(message);
  }

  public clearSuccessMessage(): void {
    this.setSuccessMessage('');
  }

  public clearErrorMessage(): void {
    this.setErrorMessage('');
  }

  public clearAllMessages(): void {
    this.clearSuccessMessage();
    this.clearErrorMessage();
  }
}
