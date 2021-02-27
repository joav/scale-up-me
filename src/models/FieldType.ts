import { Schema, Document, model, Model } from "mongoose";

const schema = new Schema({
    name: String,
    saveType: String
}, {
    versionKey: false
});

export interface FieldType {
    name: string,
    saveType: "boolean"|"string"|"number"|"date"|"rel"|"rel_array"|"obj"
}

export interface FieldTypeDocument extends FieldType, Document {}

export interface FieldTypeModel extends Model<FieldTypeDocument> {}


export default model<FieldTypeDocument, FieldTypeModel>("FieldType", schema);
