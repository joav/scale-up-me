import { Schema, model, Document, Types, Model } from "mongoose";
import slugify from "slugify";
import { UserDocument } from "./User";

const schema = new Schema({
    name: String,
    slug: String,
    isCollection: Boolean,
    parent: {type: Types.ObjectId, ref: 'Module'},
    predefined: Boolean,
    order: Number,
    deleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'}
}, {
    versionKey: false
});

interface BaseModule {
    name: string;
    slug?: string;
    order?: number;
    isCollection: boolean|null;
    predefined: boolean|null;
    deleted?: boolean;
    createdAt?: Date;
    modifiedAt?: Date;
}

export interface RequestModule<T = string | Types.ObjectId> extends BaseModule {
    parent?: T;
    createdBy?: T;
    modifiedBy?: T;
}

export interface Module extends BaseModule {
    parent?: Types.ObjectId | Record<string, unknown>;
    createdBy?: Types.ObjectId | Record<string, unknown>;
    modifiedBy?: Types.ObjectId | Record<string, unknown>;
}

export interface ModuleDocument extends Module, Document {
    parent?: ModuleDocument['_id'];
    createdBy?: UserDocument['_id'];
    modifiedBy?: UserDocument['_id'];
}

export interface ModuleModel extends Model<ModuleDocument> {
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

export default model<ModuleDocument, ModuleModel>('Module', schema);
