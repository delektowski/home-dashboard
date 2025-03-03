import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeSubject = new Subject<boolean>();

  get darkModeChanges() {
    return this.darkModeSubject.asObservable();
  }

  toggleDarkMode(isDarkMode: boolean) {
    this.darkModeSubject.next(isDarkMode);
  }

}
