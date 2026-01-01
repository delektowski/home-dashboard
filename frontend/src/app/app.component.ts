import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DarkModeService} from './services/dark-mode.service';
import {HomeMeasuresService} from './services/home-measures.service';
import { Button } from "primeng/button";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {

  private darkModeService = inject(DarkModeService);
  protected homeMeasuresService = inject(HomeMeasuresService);

  ngOnInit() {
    this.toggleDarkMode();
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



