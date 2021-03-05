import { SchemaDirectiveVisitor } from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";
import { ensureSignedOut } from "../Auth";

export class GuestDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = (...args) => {
            const [, , context] = args
            ensureSignedOut(context);

            return resolve.apply(this, args)
        }
    }
}