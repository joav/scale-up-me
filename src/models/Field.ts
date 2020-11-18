import { Schema, Document, model } from "mongoose";

export interface IField extends Document {
    name: string,
    slug: string,
    fieldType: Schema.Types.ObjectId,
    module?: Schema.Types.ObjectId,
    dataFrom?: Schema.Types.ObjectId,
    data?: string,
    toList: boolean,
    toShow: boolean,
    order: number,
    required: boolean,
    help?: string,
    deleted: boolean
}

const schema = new Schema<IField>({
    name: String,
    slug: String,
    fieldType: {type: Schema.Types.ObjectId, ref: 'FieldType'},
    module: {type: Schema.Types.ObjectId, ref: 'Module'},
    dataFrom: {type: Schema.Types.ObjectId, ref: 'Module'},
    data: String,
    toList: Boolean,
    toShow: Boolean,
    order: Number,
    required: Boolean,
    help: String,
    deleted: Boolean
});

export const Field = model<IField>('Field', schema);
