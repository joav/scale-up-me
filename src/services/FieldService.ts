// DEPS
import { async } from "validate.js";
import { Types } from "mongoose";
import { omitBy, isNil, isEmpty } from "lodash";
// Services
// Models
import FieldModel, { RequestField } from "../models/Field";
import Module from "../models/Module";
import FieldType from "../models/FieldType";
import User from "../models/User";
// Utils
import constraints from "../constraints/FieldConstraints";
import { notFound } from "../utils/messages";

export async function createField(body: RequestField<string|Types.ObjectId>) {
    await async(omitBy({...body, fieldType: body.fieldType.toString(), module: body.module.toString(), dataFrom: body.dataFrom?.toString()}, isNil), constraints.createField);
    if(!isNil(body.data) && !isNil(body.dataFrom)) throw new Error("Can not be send data and dataFrom together");
    const [fieldType, module, dataFrom, createdBy] = await Promise.all([
        FieldType.findById(body.fieldType),
        Module.findById(body.module),
        isNil(body.dataFrom)?null:Module.findById(body.dataFrom),
        isEmpty(body.createdBy)?null:User.findById(body.createdBy),
    ]);
    if(isNil(fieldType)) throw new Error(notFound("FieldType"));
    if(isNil(module)) throw new Error(notFound("Module"));
    if(!isNil(body.dataFrom) && isNil(dataFrom)) throw new Error(notFound("Module for data"));
    if(!isEmpty(body.createdBy) && isNil(createdBy)) throw new Error(notFound("Creator"));
    return await (new FieldModel({
        ...body,
        slug: body.slug?await FieldModel.createSlug(body.slug, module._id):await FieldModel.createSlug(body.name, module._id),
        fieldType: fieldType._id,
        module: module._id,
        dataFrom: dataFrom?dataFrom._id:undefined,
        deleted: false,
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date(),
    })).save();
}

export async function clearFields() {
    return await FieldModel.deleteMany({});
}
