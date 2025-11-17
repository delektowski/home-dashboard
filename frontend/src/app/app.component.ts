import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuBarComponent} from './menu-bar/menu-bar.component';
import {DarkModeService} from './services/dark-mode.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})

export class AppComponent implements OnInit {

  private darkModeService = inject(DarkModeService);

  ngOnInit() {
    this.toggleDarkMode();
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');

    this.darkModeService.toggleDarkMode(true);

  }
}



