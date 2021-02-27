import { Schema, Document, model, Types, Model } from "mongoose";
import slugify from "slugify";
import { FieldTypeDocument } from "./FieldType";
import { ModuleDocument } from "./Module";
import { UserDocument } from "./User";

const schema = new Schema({
    name: String,
    slug: String,
    fieldType: {type: Types.ObjectId, ref: 'FieldType'},
    module: {type: Types.ObjectId, ref: 'Module'},
    dataFrom: {type: Types.ObjectId, ref: 'Module'},
    data: String,
    toList: Boolean,
    toShow: Boolean,
    order: Number,
    required: Boolean,
    help: String,
    deleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'}
}, {
    versionKey: false
});

interface BaseField {
    name: string;
    slug?: string;
    data?: string;
    toList: boolean;
    toShow: boolean;
    order: number;
    required: boolean;
    help: string;
    deleted: boolean;
    createdAt?: Date;
    modifiedAt?: Date;
}

export interface RequestField<T = string | Types.ObjectId> extends BaseField {
    fieldType: T;
    module: T;
    dataFrom?: T;
    createdBy?: T;
    modifiedBy?: T;
}

export interface Field extends BaseField {
    fieldType: Types.ObjectId | Record<string, unknown>;
    module: Types.ObjectId | Record<string, unknown>;
    dataFrom?: Types.ObjectId | Record<string, unknown>;
    createdBy?: Types.ObjectId | Record<string, unknown>;
    modifiedBy?: Types.ObjectId | Record<string, unknown>;
}

export interface FieldDocument extends Field, Document {
    fieldType: FieldTypeDocument['_id'];
    module: ModuleDocument['_id'];
    dataFrom?: ModuleDocument['_id'];
    createdBy?: UserDocument['_id'];
    modifiedBy?: UserDocument['_id'];
}

export interface FieldModel extends Model<FieldDocument> {
    createSlug(name: string, module:string|Types.ObjectId):Promise<string>;
}

schema.statics.createSlug = async function createSlug(name:string, module:string|Types.ObjectId) {
    let slug = slugify(name, {lower: true});
    const slugCount: number = await this.countDocuments({
        slug: new RegExp(`^${slug}`),
        module: new Types.ObjectId(module)
    });
    if(slugCount) {
        slug += `-${slugCount}`;
    }
    return slug;
}

export default model<FieldDocument, FieldModel>('Field', schema);
