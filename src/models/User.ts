import { Schema, Document, model, Types, Model } from "mongoose";
import { PermisionDocument } from "./Permision";
import { RoleDocument } from "./Role";

const schema = new Schema({
    role: {type: Types.ObjectId, ref: 'Role'},
    password: String,
    providers: Object,
    customPermisions: [{type: Types.ObjectId, ref: 'Permision'}],
    data: Object,
    createdAt: Date,
    modifiedAt: Date,
    deleted: Boolean,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'}
}, {
    versionKey: false
});

interface BaseUser {
    password: string,
    providers: Record<string, string>,
    createdAt?: Date,
    modifiedAt?: Date,
    deleted: boolean
}

export interface RequestUser<T = string | Types.ObjectId> extends BaseUser {
    role: T,
    customPermisions: T[],
    createdBy?: T,
    modifiedBy?: T
}

export interface User extends BaseUser {
    role: Types.ObjectId | Record<string, unknown>,
    customPermisions: (Types.ObjectId | Record<string, unknown>)[],
    createdBy?: Types.ObjectId | Record<string, unknown>,
    modifiedBy?: Types.ObjectId | Record<string, unknown>
}

export interface UserDocument extends User, Document {
    role: RoleDocument['_id'],
    customPermisions: PermisionDocument['_id'][],
    createdBy?: UserDocument['_id'],
    modifiedBy?: UserDocument['_id']
}

export interface UserModel extends Model<UserDocument> { }

export default model<UserDocument, UserModel>('User', schema);
