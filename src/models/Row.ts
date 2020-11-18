import { Schema, Document, model } from "mongoose";

export interface IRow extends Document {
    module: Schema.Types.ObjectId,
    data: Record<string, string|boolean|number|Date>,
    createdAt: Date,
    modifiedAt?: Date,
    createdBy: Schema.Types.ObjectId,
    modifiedBy?: Schema.Types.ObjectId,
    deleted: boolean
}

const schema = new Schema<IRow>({
    module: {type: Schema.Types.ObjectId, ref: 'Module'},
    data: Object,
    createdAt: Date,
    modifiedAt: Date,
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    modifiedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    deleted: Boolean
});

export const Row = model<IRow>('Row', schema);
