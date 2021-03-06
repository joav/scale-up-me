import { Types } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";
import { getModuleBySlug } from "../services/ModuleService";
import { ValidationError } from "apollo-server-express";
import { notFound } from "./messages";
import Field, { FieldDocument } from "../models/Field";
import { isEmpty } from "lodash";

export async function encrypt(word: string) {
    const salt = await genSalt(10);
    return await hash(word, salt);
}

export async function comparePasswordHash(password: string, hash: string) {
    return await compare(password, hash);
}

export async function simpleValidatePermisions(permisions: (string | Types.ObjectId)[]) {
    return Promise.all(permisions.map(async p => {
        if(p.toString().length !== 24) throw new Error("Invalid Permision id");
    }));
}

export async function selectFields(moduleSlug: string, fields?:string[], inverse = false) {
    if(!fields || isEmpty(fields)) return {};
    const module = await getModuleBySlug(moduleSlug);
    if(!module) throw new ValidationError(notFound(moduleSlug));
    let allFields: FieldDocument[] = [];
    if(inverse) {
        allFields = await Field.find({
            module: module._id,
            deleted: false
        });
    }
    const fieldsDocuments = await Field.find({
        module: module._id,
        slug: {
            $in: fields
        },
        deleted: false
    });
    if(!fieldsDocuments.length) throw new ValidationError(notFound("Fields"));
    const fieldsSlugs = fieldsDocuments.map(f => f.slug);
    if(fieldsDocuments.length < fields.length) throw new ValidationError(notFound(`Fields: "${fields.filter(s => !fieldsSlugs.includes(s)).join(', ')}"`));
    if(inverse) {
        const fieldsSlugs = allFields.map(f => f.slug);
        return fieldsSlugs.filter(s => !fields.includes(s || "")).reduce<Record<string, number>>((prev, curr) => ({...prev, [`data.${curr}`]: 0}),{});
    }
    else{
        return fields.reduce<Record<string, number>>((prev, curr) => ({...prev, [`data.${curr}`]: 1}),{});
    }
}

export async function selectToListFields(moduleSlug: string, inverse = false) {
    const module = await getModuleBySlug(moduleSlug);
    if(!module) throw new ValidationError(notFound(moduleSlug));
    const fieldsDocuments = await Field.find({
        module: module._id,
        toList: true,
        deleted: false
    });
    if(!fieldsDocuments.length) return [];
    return await selectFields(moduleSlug, fieldsDocuments.map(f => f.slug || ""), inverse);
}

export async function selectToShowFields(moduleSlug: string, inverse = false) {
    const module = await getModuleBySlug(moduleSlug);
    if(!module) throw new ValidationError(notFound(moduleSlug));
    const fieldsDocuments = await Field.find({
        module: module._id,
        toShow: true,
        deleted: false
    });
    if(!fieldsDocuments.length) return [];
    return await selectFields(moduleSlug, fieldsDocuments.map(f => f.slug || ""), inverse);
}
