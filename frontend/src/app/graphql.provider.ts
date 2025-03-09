import { Apollo, provideApollo } from 'apollo-angular';
import { inject, Provider } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql/index';

export const graphqlProvider: Provider[] = [provideApollo(() => {
  const httpLink = inject(HttpLink);// Create an http link:
  const http = httpLink.create({
    uri: '/graphql',
  });

  // WebSocket URL uses relative path with location.protocol to determine ws/wss
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.host}/graphql`;

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
