import {inject, Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult, FetchResult} from '@apollo/client';
import {HomeMeasureModel} from '../models/home-measure.model';
import {MeasuresPlaceNames} from '../models/measures-place-names.model';
import {HomeMeasuresAllPlacesModel} from '../models/home-measures-all-places.model';


const GET_MEASURES_HOME = gql`
  query getMeasuresHome($placeName: String!) {
    getMeasuresHome(placeName: $placeName) {
      id
      placeName
      temperature
      humidity
      createdAt
    }
  }
`;

const GET_MEASURES_PLACE_NAMES = gql`
  query getDistinctPlaceNames {
    getDistinctPlaceNames {
      placeNames
    }
  }
`;

const GET_LATEST_MEASURES_FOR_ALL_PLACES = gql`
  query getLatestMeasuresForAllPlaces {
    getLatestMeasuresForAllPlaces {
        placeName
        temperature
        humidity
        createdAt
      }
  }
`;

const GET_MEASURES_FOR_ALL_PLACES = gql`
  query getMeasuresForAllPlaces {
    getMeasuresForAllPlaces {
        placeName
        measures {
          temperature
          humidity
          createdAt
        }
      }
  }
`;

const GET_CURRENT_MEASURE_HOME = gql`
  query getCurrentMeasureHome($placeName: String!) {
    getCurrentMeasureHome(placeName: $placeName) {
      placeName
      temperature
      createdAt
    }
  }
`;

const MEASURES_HOME_SUBSCRIPTION = gql`
  subscription {
    measuresHomeAdded {
      placeName
      temperature
      createdAt
      isForCurrentMeasure
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class HomeMeasuresService {
  private apollo = inject(Apollo);

  isSpinner = false

  getMeasuresHome(placeName: string): Observable<ApolloQueryResult<{ getMeasuresHome: HomeMeasureModel[] }>> {
    return this.apollo
      .watchQuery<{ getMeasuresHome: HomeMeasureModel[] }>({
        query: GET_MEASURES_HOME,
        variables: {
          placeName,
        },
        fetchPolicy: 'no-cache'

      })
      .valueChanges;
  }

  getCurrentHomeMeasure(placeName: string): Observable<ApolloQueryResult<{ getCurrentMeasureHome: HomeMeasureModel }>> {
    return this.apollo
      .watchQuery<{ getCurrentMeasureHome: HomeMeasureModel }>({
        query: GET_CURRENT_MEASURE_HOME,
        variables: {
          placeName,
        },
        fetchPolicy: 'no-cache'
      })
      .valueChanges;
  }


  getLatestMeasuresForAllPlaces(): Observable<ApolloQueryResult<{

      getLatestMeasuresForAllPlaces: HomeMeasureModel[]
    }
  >> {
    return this.apollo.watchQuery< {
        getLatestMeasuresForAllPlaces: HomeMeasureModel[]
      }
    >({
        query: GET_LATEST_MEASURES_FOR_ALL_PLACES,
        fetchPolicy: 'no-cache'
      }).valueChanges;
  }
  getMeasuresForAllPlaces(): Observable<ApolloQueryResult<{

      getMeasuresForAllPlaces: HomeMeasuresAllPlacesModel
    }
  >> {
    return this.apollo.watchQuery< {
        getMeasuresForAllPlaces: HomeMeasuresAllPlacesModel
      }
    >({
        query: GET_MEASURES_FOR_ALL_PLACES,
        fetchPolicy: 'no-cache'
      }).valueChanges;
  }

  getMeasuresPlaceNames(): Observable<ApolloQueryResult<{ getDistinctPlaceNames: MeasuresPlaceNames }>> {
    return this.apollo
      .watchQuery<{ getDistinctPlaceNames: MeasuresPlaceNames }>({
        query: GET_MEASURES_PLACE_NAMES,
        fetchPolicy: 'no-cache'
      }).valueChanges;
  }

  subscribeMeasuresHome(): Observable<FetchResult<{ measuresHomeAdded: HomeMeasureModel }>> {
    return this.apollo.subscribe<{ measuresHomeAdded: HomeMeasureModel }>({
      query: MEASURES_HOME_SUBSCRIPTION,
    });
  }

  setSpinner(isLoading = false) {
    this.isSpinner = isLoading;
  }

}
