import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gql } from 'apollo-angular';
import { PopupMenuComponent } from './popup-menu/popup-menu.component';


const GET_MEASURES_HOME = gql`
  query getMeasuresHome($placeName: String!) {
    getMeasuresHome(placeName: $placeName) {
      id
      placeName
      temperature
      humidity
    }
  }
`;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopupMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
}



