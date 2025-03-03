import { Module } from '@nestjs/common';
import { MeasuresModule } from './measures/measures.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URI || 'mongodb://user:pass@mongodb:27017/home_dashboard?authSource=admin',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      }
      
    }),
    MeasuresModule,
  ],
})
export class AppModule {}
