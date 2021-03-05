import { IResolverObject, IResolvers } from "apollo-server-express";
import { concat, omit, some, uniqBy } from "lodash";
import { AuthResponse } from "../Auth";
import { PermisionDocument } from "../models/Permision";
import User, { UserDocument } from "../models/User";
import { selectFields } from "../utils/functions";
import * as UserService from "../services/UserService";

export default ({
    Query: {
        async getUser(_, {id, fields}: {id: string, fields?: string[]}, ctx): Promise<any> {
            return await User.findById(id, {
              "providers.username.password": 0,
              "providers.email.password": 0,
              ...(await selectFields('user', fields, true))
            }).populate([
                {
                    path: 'role',
                    populate: "permisions"
                },
                {
                    path: "customPermisions"
                }
            ])
        },
        async me(_, args: void, ctx) {
            return UserService.getById(ctx.user.id, true);
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