import { IResolvers } from 'graphql-tools';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLScalarType, Kind } from 'graphql';
import { merge } from 'lodash';
import Role from './resolvers/role.resolver';
import Permision from './resolvers/permision.resolver';
import User from './resolvers/user.resolver';
import Module from './resolvers/module.resolver';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: Date) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value: string | number | Date) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string {
        return `👋 Hello world! 👋`;
    }
  },
  JSONObject: GraphQLJSONObject,
  Date: dateScalar
};
export default merge(resolverMap, User, Role, Permision, Module);