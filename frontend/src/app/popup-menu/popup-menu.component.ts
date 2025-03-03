import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-popup-menu',
  imports: [Menu, ButtonModule],
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.scss'
})
export class PopupMenuComponent implements OnInit {
  items: MenuItem[] | undefined;
  isDarkMode = true;
  private darkModeService = inject(DarkModeService);

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Measures',
            icon: PrimeIcons.GAUGE,
            iconStyle: { color: 'green', fontSize: '20px' },
            routerLink: 'measures',
          }
        ]
      }
    ];

    this.toggleDarkMode();
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.toggleDarkMode(this.isDarkMode);

  }
}
