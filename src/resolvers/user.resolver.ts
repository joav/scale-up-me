import { IResolverObject, IResolvers } from "apollo-server-express";
import { concat, some, uniqBy } from "lodash";
import { AuthResponse } from "../Auth";
import { PermisionDocument } from "../models/Permision";
import { UserDocument } from "../models/User";
import * as UserService from "../services/UserService";
import { permisions } from "../decorators";

class Resolvers {
    @permisions(['view', 'edit'], 'user')
    static async getUser(_: any, {id, fields}: {id: string, fields?: string[]}, ctx: AuthResponse) {
        return await UserService.getById(id, true, false, fields);
    }
}

export default ({
    Query: {
        getUser: Resolvers.getUser,
        async me(_: any, {fields}: {fields?: string[]}, ctx: AuthResponse) {
            return UserService.getById(ctx.user.id, true, false, fields);
        }
    } as IResolverObject<any, AuthResponse>,
    Mutation: {
        async login(_: void, {provider, uid, password}: {provider: string, uid: string, password: string}, ctx) {
            return await UserService.login(provider, uid, password);
        },
        async refresh(_: void, args: void, ctx) {
            return await UserService.refreshToken({...ctx.user});
        }
    } as IResolverObject<any, AuthResponse>,
    User: {
        async permisions(_, args: void, context) {
            const rolePermisions: PermisionDocument[] = _.role.permisions;
            if(some(rolePermisions, p => p.slug === "unrestricted")) return ["unrestricted"];
            return uniqBy(concat(rolePermisions, _.customPermisions as PermisionDocument[]), p => p._id.toString()).map(p => p.slug);
        }
    } as IResolverObject<UserDocument, AuthResponse>
} as IResolvers);