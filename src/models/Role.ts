import { Schema, Document, model, Types, Model } from "mongoose";
import { PermisionDocument } from "./Permision";
import { UserDocument } from "./User";

const schema = new Schema({
    name: String,
    permisions: [{type: Types.ObjectId, ref: "Permision"}],
    deleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Types.ObjectId, ref: 'User'}
}, {
    versionKey: false
});

interface BaseRole {
    name: string;
    deleted: boolean;
    createdAt?: Date;
    modifiedAt?: Date;
};

export interface RequestRole<T = string | Types.ObjectId> extends BaseRole {
    permisions: T[];
    createdBy?: T;
    modifiedBy?: T;
}

export interface Role extends BaseRole {
    permisions: (Types.ObjectId | Record<string, unknown>)[];
    createdBy?: Types.ObjectId | Record<string, unknown>;
    modifiedBy?: Types.ObjectId | Record<string, unknown>;
}

export interface RoleDocument extends Role, Document {
    permisions: PermisionDocument['_id'][];
    createdBy?: UserDocument['_id'];
    modifiedBy?: UserDocument['_id'];
}

export interface RoleModel extends Model<RoleDocument> { }

export const Role = model<RoleDocument, RoleModel>('Role', schema);
