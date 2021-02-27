// DEPS
import { Types } from "mongoose";
import { async } from "validate.js";
import { isNil, isEmpty } from "lodash";
// Services
// Models
import Module, { RequestModule } from "../models/Module";
import User from "../models/User";
// Utils
import constraints from "../constraints/ModuleConstraints";
import { notFound } from "../utils/messages";
import { RequestPermision } from "../models/Permision";
import { createPermision } from "./PermisionService";

export async function createModule(body: RequestModule<string|Types.ObjectId>){
    await async(body.parent?{...body, parent: body.parent.toString()}: body, constraints.createModule);
    const [parent, createdBy] = await Promise.all([
        isNil(body.parent)?null:Module.findById(body.parent),
        isEmpty(body.createdBy)?null:User.findById(body.createdBy)
    ]);
    if(!isNil(body.parent) && !parent){
        throw new Error(notFound("Parent Module"));
    }else if(parent?.isCollection) throw new Error("The parent is a collection");
    if(!isEmpty(body.createdBy) && isNil(createdBy)) throw new Error(notFound("Creator"));
    const bodyInsert:RequestModule<Types.ObjectId> = {
        ...body,
        parent: parent?parent._id:undefined,
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date(),
        slug: body.slug || await Module.createSlug(body.name),
        deleted: false,
        order: body.order || 0
    };
    const module = await (new Module(bodyInsert)).save();
    await Promise.all(([
        {
            name: `Access to ${module.name} Module`,
            slug: `access-${module.slug}`,
            module: module._id,
        },
        {
            name: `Create ${module.name} Item`,
            slug: `create-${module.slug}`,
            module: module._id,
        },
        {
            name: `Edit ${module.name} Item`,
            slug: `edit-${module.slug}`,
            module: module._id,
        },
        {
            name: `List ${module.name} Items`,
            slug: `list-${module.slug}`,
            module: module._id,
        },
        {
            name: `View ${module.name} Item`,
            slug: `view-${module.slug}`,
            module: module._id,
        },
        {
            name: `Delete ${module.name} Item`,
            slug: `delete-${module.slug}`,
            module: module._id,
        },
        {
            name: `Config ${module.name} Module`,
            slug: `config-${module.slug}`,
            module: module._id,
        }
    ] as RequestPermision<Types.ObjectId>[]).map(createPermision))
    return module;
}

export async function getModuleBySlug(slug:string) {
    return await Module.findOne({ slug });
}

export async function clearModules() {
    return await Module.deleteMany({});
}
