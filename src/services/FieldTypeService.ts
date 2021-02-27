// DEPS
import validate from "validate.js";
// Services
// Models
import FieldTypeModel, { FieldType } from "../models/FieldType";
// Utils
import constraints from "../constraints/FieldTypeConstraints";

export async function createFieldType(body: FieldType) {
    await validate.async(body, constraints.createFieldType);
    return await (new FieldTypeModel(body)).save();
}

export async function getFieldTypeByName(name: string) {
    return await FieldTypeModel.findOne({
        name
    });
}

export async function clearFieldTypes() {
    return await FieldTypeModel.deleteMany({});
}
