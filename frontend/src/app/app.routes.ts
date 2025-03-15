import { Routes } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { HomeMeasureComponent } from './home-measure/home-measure.component';

export const routes: Routes = [{
  path: '',
  redirectTo: "measures",
  pathMatch: 'full'
},{
  path: 'measures',
  component: HomeMeasureComponent,
  title: 'Home Measures',
}];
