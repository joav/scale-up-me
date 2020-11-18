import { Schema, model, Document } from "mongoose";

export interface IModule extends Document {
    name: string,
    slug: string,
    isCollection: boolean,
    parent?: Schema.Types.ObjectId,
    predefined: boolean
}

const schema = new Schema<IModule>({
    "name": String,
    "slug": String,
    "isCollection": Boolean,
    "parent": {type: Schema.Types.ObjectId, ref: 'Module'},
    "predefined": Boolean,
});

export const Module = model<IModule>('Module', schema);
