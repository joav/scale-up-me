import { SchemaDirectiveVisitor } from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { ensureSignedIn } from "../Auth";

export class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = (...args) => {
            const [, , context] = args
            ensureSignedIn(context);

            return resolve.apply(this, args)
        }
    }
}