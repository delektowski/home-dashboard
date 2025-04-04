import { Apollo, provideApollo } from 'apollo-angular';
import { inject, Provider, isDevMode } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment';

export const graphqlProvider: Provider[] = [provideApollo(() => {
  const httpLink = inject(HttpLink);

  // In development mode, browser needs to access localhost endpoints
  const graphqlEndpoint = environment.production
    ? '/graphql'
    : 'http://localhost:3000/graphql'; // Use localhost for browser requests

  // Create an http link
  const http = httpLink.create({
    uri: graphqlEndpoint,
  });

  return {
    link: http,
    cache: new InMemoryCache(),
  };
}), Apollo];
