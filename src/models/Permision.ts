import { Schema, Document, model, Types, Model } from "mongoose";
import slugify from "slugify";
import { ModuleDocument } from "./Module";

const schema = new Schema({
    name: String,
    slug: String,
    module: {type: Types.ObjectId, ref: "Module"},
    deleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'}
}, {
    versionKey: false
});

interface BasePermision {
    name: string;
    slug?: string;
    deleted?: boolean;
    createdAt?: Date;
    modifiedAt?: Date;
}

export interface RequestPermision<T = string | Types.ObjectId> extends BasePermision {
    module?: T;
    createdBy?: T;
    modifiedBy?: T;
}

export interface Permision extends BasePermision {
    module?: Types.ObjectId | Record<string, unknown>;
    createdBy?: Types.ObjectId | Record<string, unknown>;
    modifiedBy?: Types.ObjectId | Record<string, unknown>;
}

export interface PermisionDocument extends Permision, Document {
    module?: ModuleDocument['_id'];
    createdBy?: Document['_id'];
    modifiedBy?: Document['_id'];
}

export interface PermisionModel extends Model<PermisionDocument> {
    createSlug(name: string):Promise<string>;
}

schema.statics.createSlug = async function createSlug(name:string) {
    let slug = slugify(name, {lower: true});
    const slugCount: number = await this.countDocuments({
        slug: new RegExp(`^${slug}`)
    });
    if(slugCount) {
        slug += `-${slugCount}`;
    }
    return slug;
}

export default model<PermisionDocument, PermisionModel>("Permision", schema);
