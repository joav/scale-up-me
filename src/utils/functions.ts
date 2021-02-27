import { Types } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

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