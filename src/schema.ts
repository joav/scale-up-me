import 'graphql-import-node';
import * as Base from './schema/base.graphql';
import * as Role from './schema/role.graphql';
import * as Permision from './schema/permision.graphql';
import * as User from './schema/user.graphql';
import * as Module from './schema/module.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolverMap';
import schemaDirectives from './directives';
import { GraphQLSchema } from 'graphql';
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [Base, User, Role, Permision, Module],
  resolvers,
  schemaDirectives
});
export default schema;