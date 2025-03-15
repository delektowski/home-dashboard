import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuBarComponent} from './menu-bar/menu-bar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent],
  templateUrl: './app.component.html',
})

export class AppComponent {
}



