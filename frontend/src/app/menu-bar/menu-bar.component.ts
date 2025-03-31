import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Menubar, MenubarModule} from 'primeng/menubar';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {Button} from 'primeng/button';
import {DarkModeService} from '../services/dark-mode.service';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule, Menubar, Button],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isDarkMode = false;
  private darkModeService = inject(DarkModeService);


  ngOnInit() {
    this.toggleDarkMode();
    this.items = [{
      label: 'Measures',
      icon: PrimeIcons.GAUGE,
      iconStyle: {color: 'green', fontSize: '20px'},
      routerLink: 'measures',
    }];
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.toggleDarkMode(this.isDarkMode);

  }


}
