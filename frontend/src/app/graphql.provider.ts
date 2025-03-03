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
    uri: 'https://dashboard-server.deldev.ovh/graphql',
  });

  const ws = new GraphQLWsLink(
    createClient({
        url: `ws://dashboard-server.deldev.ovh/graphql`,
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
