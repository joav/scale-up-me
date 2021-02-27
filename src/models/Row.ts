import { Schema, Document, model, Types, Model } from "mongoose";
import { ModuleDocument } from "./Module";
import { UserDocument } from "./User";

const schema = new Schema({
    module: {type: Types.ObjectId, ref: 'Module'},
    data: Object,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'},
    deleted: Boolean
}, {
    versionKey: false
});

interface BaseRow {
    createdAt?: Date,
    modifiedAt?: Date,
    deleted: boolean
}

export interface RequestRow<T = string | Types.ObjectId> extends BaseRow {
    module: T,
    data: Record<string, string|boolean|number|Date|T|Record<string, unknown>|(T|Record<string, unknown>)[]>,
    modifiedBy?: T
}

export interface Row extends BaseRow {
    module: Types.ObjectId | Record<string, unknown>,
    data: Record<string, string|boolean|number|Date|Types.ObjectId|Record<string, unknown>|(string|Types.ObjectId|Record<string, unknown>)[]>,
    modifiedBy?: Types.ObjectId | Record<string, unknown>
}

export interface RowDocument extends Row, Document {
    module: ModuleDocument['_id'],
    data: Record<string, string|boolean|number|Date|RowDocument['_id']|Document['_id']|Record<string, unknown>|(string|RowDocument['_id']|Document['_id'])[]>,
    modifiedBy?: UserDocument['_id']
}

export interface RowModel extends Model<RowDocument> { }

export default model<RowDocument, RowModel>('Row', schema);
