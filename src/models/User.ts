import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    role: Schema.Types.ObjectId;
    password: string;
    providers: Record<string, string>;
    customPermisions: Schema.Types.ObjectId[];
    data: Record<string, string|boolean|number|Date>;
    createdAt: Date;
    modifiedAt?: Date;
    createdBy?: Schema.Types.ObjectId;
    modifiedBy?: Schema.Types.ObjectId;
}

const schema = new Schema<IUser>({
    role: {type: Schema.Types.ObjectId, ref: 'Role'},
    password: String,
    providers: Object,
    customPermisions: [{type: Schema.Types.ObjectId, ref: 'Permision'}],
    data: Object,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const User = model<IUser>('User', schema);
