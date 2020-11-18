import { Schema, Document, model } from "mongoose";

export interface IPermision extends Document {
    name: string,
    slug: string,
    module: Schema.Types.ObjectId
}

const schema = new Schema<IPermision>({
    "name": String,
    "slug": String,
    "module": {type: Schema.Types.ObjectId, ref: "Module"}
});

export const Permision = model<IPermision>("Permision", schema);
