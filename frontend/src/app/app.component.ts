import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DarkModeService} from './services/dark-mode.service';
import {HomeMeasuresService} from './services/home-measures.service';
import { GlobalToggleBtnComponent } from "./global-toggle-btn/global-toggle-btn.component";
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToggleBtnComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {

  private darkModeService = inject(DarkModeService);
  protected homeMeasuresService = inject(HomeMeasuresService);
  private swUpdate = inject(SwUpdate);

  ngOnInit() {
    this.toggleDarkMode();
    this.checkForUpdates();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      // Check for updates when app starts
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
            window.location.reload();
        }
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



