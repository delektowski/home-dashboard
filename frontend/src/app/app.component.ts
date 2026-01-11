import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from './services/dark-mode.service';
import { HomeMeasuresService } from './services/home-measures.service';
import { SwUpdate } from '@angular/service-worker';
import { fromEvent, map, take, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
      fromEvent(document, 'visibilitychange').pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => !document.hidden) // Only check when becoming visible
      ).subscribe(() => {
        this.swUpdate.checkForUpdate()
          .then((updateFound) => {
            console.log("Update found: ", updateFound);
          })
          .catch(err => console.error('Update check failed:', err));
      });
      
      // Listen for available updates
      this.swUpdate.versionUpdates.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(event => {
        if (event.type === 'VERSION_READY') {
          console.log('New version ready, reloading...');
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
      });
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
