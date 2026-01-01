import {inject, Injectable, signal} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client';
import {HomeMeasuresAllPlacesModel} from '../models/home-measures-all-places.model';


const GET_MEASURES_FOR_ALL_PLACES = gql`
  query getMeasuresForAllPlaces {
    getMeasuresForAllPlaces {
      maxTemperature
      minTemperature
      avgTemperature
      maxHumidity
      minHumidity
      avgHumidity
      measures {
        placeName
        temperature
        humidity
        createdAt
      }
    }
  }
`;


@Injectable({
  providedIn: 'root',
})
export class HomeMeasuresService {
  private apollo = inject(Apollo);

  isSpinner = false

  isAllCollapsed = signal(true);
  anyIsCollapsed: boolean | null = null;


  getMeasuresForAllPlaces(): Observable<ApolloQueryResult<{

    getMeasuresForAllPlaces: HomeMeasuresAllPlacesModel[]
  }
  >> {
    return this.apollo.watchQuery<{
      getMeasuresForAllPlaces: HomeMeasuresAllPlacesModel[]
    }
    >({
      query: GET_MEASURES_FOR_ALL_PLACES,
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }


  setSpinner(isLoading = false) {
    this.isSpinner = isLoading;
  }

}
