// DEPS
import { Types } from "mongoose";
import { async } from "validate.js";
import { isEmpty, isNil } from "lodash";
// Services
// Models
import Role, { RequestRole } from "../models/Role";
// Utils
import constraints from "../constraints/RoleConstraints";
import { notFound } from "../utils/messages";
import { simpleValidatePermisions } from "../utils/functions";
import User from "../models/User";

export async function createRole(body: RequestRole<string|Types.ObjectId>) {
    await async(body, constraints.createRole);
    await simpleValidatePermisions(body.permisions || []);
    const createdBy = isEmpty(body.createdBy)?null:await User.findById(body.createdBy);
    if(!isEmpty(body.createdBy) && isNil(createdBy)) throw new Error(notFound("Creator"));
    return await (new Role({
        ...body,
        permisions: (body.permisions || []).map(p => Types.ObjectId(p.toString())),
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date(),
        deleted: false
    })).save();
}

export async function getRoleByName(name:string) {
    return await Role.findOne({ name });
}

export async function clearRoles() {
    return await Role.deleteMany({});
}