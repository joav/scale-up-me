import { ValidationError } from "apollo-server-errors";
import { IResolverObject, IResolvers } from "graphql-tools";
import { isNil } from "lodash";
import { AuthResponse } from "../Auth";
import { permisions } from "../decorators";
import { RequestModule } from "../models/Module";
import * as ModuleService from "../services/ModuleService";
import { notFound } from "../utils/messages";

class Resolvers {
    @permisions(['access'], 'row')
    static async getModules(_: void, {moduleSlug = null}: {moduleSlug?: string|null}, ctx: AuthResponse) {
        const parent = moduleSlug?(await ModuleService.getModuleBySlug(moduleSlug)):null;
        if(moduleSlug && isNil(parent)) throw new ValidationError(notFound("Parent module"));
        if(moduleSlug && parent?.isCollection) throw new ValidationError("The Parent module is a collection");
        const accessModules = ctx.user.permisions[0] === "unrestricted"?[]:ctx.user.permisions.filter(p => p.includes('access')).length?ctx.user.permisions.filter(p => p.includes('access')).map(p => p.split('-').reverse()[0]):null;
        if(!accessModules) return [];
        return await ModuleService.getByParentAndSlugs(parent?parent._id:null, accessModules);
    }

    @permisions(['config'], 'row')
    static async getModule(_: void, { moduleSlug }: {moduleSlug: string}, ctx: AuthResponse) {
        const module = await ModuleService.getModuleBySlug(moduleSlug);
        if(isNil(module)) throw new ValidationError(notFound(`Module: ${moduleSlug}`));
        return module;
    }

    @permisions(['create'], 'module')
    static async getParentModules(_: void, args: any, ctx: AuthResponse) {
        return await ModuleService.getParentModules();
    }

    @permisions(['create'], 'module')
    static async createModule(_: void, {name, isCollection, parent, order}: {name: string, isCollection: boolean, parent: string | null | undefined, order: number}, ctx: AuthResponse) {
        return await ModuleService.createModule({
            name,
            isCollection,
            order,
            parent
        } as RequestModule<string>);
    }
}

export default ({
    Query: {
        getModules: Resolvers.getModules,
        getModule: Resolvers.getModule,
        getParentModules: Resolvers.getParentModules
    } as IResolverObject<any, AuthResponse>,
    Mutation: {
        createModule: Resolvers.createModule
    } as IResolverObject<any, AuthResponse>
} as IResolvers);