import { Apollo, provideApollo } from 'apollo-angular';
import { inject, Provider, isDevMode } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql/index';
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

  // WebSocket URL determination
  let wsUrl: string;

  if (environment.production) {
    // Production: Use relative path with protocol detection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${wsProtocol}//${window.location.host}/graphql`;
  } else {
    // Development: Connect through localhost for browser access
    wsUrl = 'ws://localhost:3000/graphql';
  }

  const ws = new GraphQLWsLink(
    createClient({
      url: wsUrl,
    }),
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    ws,
    http,
  );

  return {
    link,
    cache: new InMemoryCache(),
  };
}), Apollo];
