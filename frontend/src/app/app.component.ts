import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { HomeMeasuresService } from './services/home-measures.service';
import { GlobalToggleBtnComponent } from "./global-toggle-btn/global-toggle-btn.component";
import { SwUpdate } from '@angular/service-worker';
import { fromEvent, map, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToggleBtnComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {

  private darkModeService = inject(DarkModeService);
  private swUpdate = inject(SwUpdate);
  private destroyRef = inject(DestroyRef);
  protected homeMeasuresService = inject(HomeMeasuresService);

  ngOnInit() {
    this.toggleDarkMode();
    this.checkForUpdates();
    this.checkForUpdateOnVisibilityChange();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      // Check for updates when app starts
      this.swUpdate.versionUpdates.pipe(take(1)).subscribe(event => {
        if (event.type === 'VERSION_READY') {
          window.location.reload();
        }
      });
    }
  }

  checkForUpdateOnVisibilityChange(): void {
    if (this.swUpdate.isEnabled) {
      fromEvent(document, 'visibilitychange').pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => undefined)
      ).subscribe(() => {
        this.checkForUpdates();
      });
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.darkModeService.toggleDarkMode(true);

  }

  toggleAllCollapsed() {
    this.homeMeasuresService.isAllCollapsed.set(!this.homeMeasuresService.isAllCollapsed());
  }
}



