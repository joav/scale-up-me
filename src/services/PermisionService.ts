// DEPS
import { Types } from "mongoose";
import { async } from "validate.js";
import { isEmpty, isNil } from "lodash";
// Services
// Models
import Permision, { RequestPermision } from "../models/Permision";
import Module from "../models/Module";
import User from "../models/User";
// Utils
import constraints from "../constraints/PermisionConstraints";
import { notFound } from "../utils/messages";

export async function createPermision(body: RequestPermision<string|Types.ObjectId>) {
    await async(body.module?{...body, module: body.module.toString()}: body, constraints.createPermision);
    const [module, createdBy] = await Promise.all([
        isNil(body.module)?null:Module.findById(body.module),
        isEmpty(body.createdBy)?null:User.findById(body.createdBy)
    ]);
    if(!isNil(body.module) && !module) throw new Error(notFound("Parent Module"));
    if(!isEmpty(body.createdBy) && isNil(createdBy)) throw new Error(notFound("Creator"));
    return (new Permision({
        ...body,
        module: module?module._id:undefined,
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date(),
        slug: body.slug?await Permision.createSlug(body.slug):await Permision.createSlug(body.name)
    })).save();
}

export async function getPermisionBySlug(slug:string) {
    return await Permision.findOne({ slug });
}

export async function clearPermisions() {
    return await Permision.deleteMany({});
}
