import { Schema, Document, model } from "mongoose";

export interface IRole extends Document {
    name: string,
    permisions: Schema.Types.ObjectId[]
}

const schema = new Schema<IRole>({
    "name": String,
    "permisions": [{type: Schema.Types.ObjectId, ref: "Permision"}]
});

export const Role = model<IRole>('Role', schema);
