import { Schema, Document, model } from "mongoose";

export interface IFieldType extends Document {
    name: string,
    saveType: "boolean"|"string"|"number"|"date"
}

const schema = new Schema<IFieldType>({
    "name": String,
    "saveType": String
});

export const FieldType = model<IFieldType>("FieldType", schema);
