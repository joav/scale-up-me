// Dependencies
import { Types } from "mongoose";
import { isEmpty, isNil } from "lodash";
// Services
// Models
import User, { RequestUser, UserDocument } from "../models/User";
// Utils
import { encrypt } from "../utils/functions";
import { exists, empty, minLength, wrongFormat, notFound } from "../utils/messages";
import { getRoleByName } from "./RoleService";

export async function createUserWithUsername(username: string, password: string, role: string, createdById = "", customPermisions: (string|Types.ObjectId)[] = []) {
    if(isEmpty(username)) throw new Error(empty("username"));
    if(isEmpty(password)) throw new Error(empty("password"));
    if(isEmpty(role)) throw new Error(empty("role"));
    if(!/[a-z0-9.-_]{3,20}/.test(username)) throw new Error(wrongFormat("username", "letters, numbers and '-', '_', '.' and be between 3 and 20 characters"));
    if(password.length < 6) throw new Error(minLength("password", 6));
    if(!isNil(await findByProvider('username', username))) throw new Error(exists("User"));
    const createdBy = isEmpty(createdById)?null:await User.findById(createdById);
    if(!isEmpty(createdById) && isNil(createdBy)) throw new Error(notFound("Creator"));

    const roleDocument = await getRoleByName(role);
    if(isNil(roleDocument)) throw new Error(notFound(`Role: ${role}`));

    password = await encrypt(password);

    const user: RequestUser<Types.ObjectId> = {
        role: roleDocument._id,
        customPermisions: customPermisions.map(p => Types.ObjectId(p.toString())),
        providers: {
            username: {
                uid: username,
                password: password
            }
        },
        deleted: false,
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date()
    };
    return await (new User(user)).save();
}

export async function createUserWithEmail(email: string, password: string, role: string, createdById = "", customPermisions: (string|Types.ObjectId)[] = []) {
    if(isEmpty(email)) throw new Error(empty("email"));
    if(isEmpty(password)) throw new Error(empty("password"));
    if(isEmpty(role)) throw new Error(empty("role"));
    if(!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email)) throw new Error("Invalid email");
    if(password.length < 6) throw new Error(minLength("password", 6));
    if(!isNil(await findByProvider('email', email))) throw new Error(exists("User"));
    const createdBy = isEmpty(createdById)?null:await User.findById(createdById);
    if(!isEmpty(createdById) && isNil(createdBy)) throw new Error(notFound("Creator"));

    const roleDocument = await getRoleByName(role);
    if(isNil(roleDocument)) throw new Error(notFound(`Role: ${role}`));

    password = await encrypt(password);

    const user: RequestUser<Types.ObjectId> = {
        role: roleDocument._id,
        customPermisions: customPermisions.map(p => Types.ObjectId(p.toString())),
        providers: {
            email: {
                uid: email,
                password: password
            }
        },
        deleted: false,
        createdBy: createdBy?createdBy._id:undefined,
        modifiedBy: undefined,
        createdAt: new Date(),
        modifiedAt: new Date()
    };
    return await (new User(user)).save();
}

export async function mergeProvider(user: UserDocument, provider: string, data: ({uid: string} & Record<string, string>)) {
    user.providers[provider] = data;
    return user.save();
}

export async function findByProvider(provider: string, search: string) {
    return await User.findOne({
        [`providers.${provider}.uid`]: search
    });
}

export async function clearUsers() {
    return await User.deleteMany({});
}
