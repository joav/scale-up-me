import { Schema, Document, model, Types, Model } from "mongoose";
import { PermisionDocument } from "./Permision";
import { RoleDocument } from "./Role";

const schema = new Schema({
    role: {type: Types.ObjectId, ref: 'Role'},
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
    providers: Record<string, ({uid: string} & Record<string, string>)>,
    createdAt?: Date,
    modifiedAt?: Date,
    deleted: boolean
}

export interface RequestUser<T = string | Types.ObjectId> extends BaseUser {
    role: T,
    customPermisions: T[],
    data?: Record<string, string|boolean|number|Date|T|Record<string, unknown>|(T|Record<string, unknown>)[]>,
    createdBy?: T,
    modifiedBy?: T
}

export interface User extends BaseUser {
    role: Types.ObjectId | Record<string, unknown>,
    customPermisions: (Types.ObjectId | Record<string, unknown>)[],
    data?: Record<string, string|boolean|number|Date|Types.ObjectId|Record<string, unknown>|(string|Types.ObjectId|Record<string, unknown>)[]>,
    createdBy?: Types.ObjectId | Record<string, unknown>,
    modifiedBy?: Types.ObjectId | Record<string, unknown>
}

export interface UserDocument extends User, Document {
    role: RoleDocument['_id'],
    customPermisions: PermisionDocument['_id'][],
    data?: Record<string, string|boolean|number|Date|UserDocument['_id']|Document['_id']|Record<string, unknown>|(string|UserDocument['_id']|Document['_id'])[]>,
    createdBy?: UserDocument['_id'],
    modifiedBy?: UserDocument['_id']
}

export interface UserModel extends Model<UserDocument> { }

export default model<UserDocument, UserModel>('User', schema);
