import  { config } from "dotenv";
import db from '../db';
import { createModule, clearModules, getModuleBySlug } from "../services/ModuleService";
import yargs from 'yargs';
import { FieldType as FieldTypeRequest } from "../models/FieldType";
import { clearFieldTypes, createFieldType, getFieldTypeByName } from "../services/FieldTypeService";
import { clearFields, createField } from "../services/FieldService";
import { RequestField } from "../models/Field";
import { ModuleDocument } from "../models/Module";
import { RequestPermision } from "../models/Permision";
import { createPermision, clearPermisions } from "../services/PermisionService";

export async function install(clear:boolean) {
    try {
        console.log('Init');
        if(clear){
            console.log('To clear');
            await clearAll();
            console.log('Clear finished');
        }else {
            console.log('Verify user module');
            const userModule = await getModuleBySlug('user');
            if(userModule) {
                throw new Error("Already installed");
            }
            console.log('User module verified');
        }
        console.log('To create field types');
        await createFieldTypes().then(console.log);
        console.log('Field types created');
        console.log('To create Base permisions');
        await createBasePermisions().then(console.log);
        console.log('Base permisions created');
        console.log('To create user module');
        const userModule = await createModule({
            name: "User",
            predefined: true,
            isCollection: true
        });
        console.log('User module created');
        console.log('To create user fields');
        await createUserFields(userModule).then(console.log);
        console.log('User fields created');
    } catch (error) {
        console.log('error', error);
    }
    process.exit();
}

async function clearAll() {
    await Promise.all([
        clearModules(),
        clearFieldTypes(),
        clearFields(),
        clearPermisions(),
    ]);
}

function createFieldTypes() {
    return Promise.all(([
        {
            name: "text",
            saveType: "string"
        },
        {
            name: "tel",
            saveType: "string"
        },
        {
            name: "email",
            saveType: "string"
        },
        {
            name: "url",
            saveType: "string"
        },
        {
            name: "password",
            saveType: "string"
        },
        {
            name: "number",
            saveType: "number"
        },
        {
            name: "color",
            saveType: "string"
        },
        {
            name: "date",
            saveType: "date"
        },
        {
            name: "datetime",
            saveType: "date"
        },
        {
            name: "textarea",
            saveType: "string"
        },
        {
            name: "rich_text",
            saveType: "string"
        },
        {
            name: "select",
            saveType: "rel"
        },
        {
            name: "yes/no",
            saveType: "boolean"
        },
        {
            name: "switch",
            saveType: "boolean"
        },
        {
            name: "radio",
            saveType: "rel"
        },
        {
            name: "checkbox",
            saveType: "rel_array"
        },
        {
            name: "multiselect",
            saveType: "rel_array"
        },
        {
            name: "image",
            saveType: "string"
        },
        {
            name: "video",
            saveType: "string"
        },
        {
            name: "document",
            saveType: "string"
        }
    ] as FieldTypeRequest[]).map(createFieldType));
}

function createBasePermisions() {
    return Promise.all(([
        {
            name: "Unrestricted",
            slug: "unrestricted"
        },
        {
            name: "Access Permisions",
            slug: "access-permision"
        },
        {
            name: "Create Permisions",
            slug: "create-permision"
        },
        {
            name: "Edit Permisions",
            slug: "edit-permision"
        },
        {
            name: "List Permisions",
            slug: "list-permision"
        },
        {
            name: "View Permisions",
            slug: "view-permision"
        },
        {
            name: "Access Roles",
            slug: "access-role"
        },
        {
            name: "Create Roles",
            slug: "create-role"
        },
        {
            name: "Edit Roles",
            slug: "edit-role"
        },
        {
            name: "List Roles",
            slug: "list-role"
        },
        {
            name: "View Roles",
            slug: "view-role"
        },
    ] as RequestPermision[]).map(createPermision));
}

async function createUserFields(userModule: ModuleDocument) {
    const textType = await getFieldTypeByName("text");
    return Promise.all(([
        {
            name: "First name",
            slug: "fname",
            fieldType: textType?._id,
            module: userModule._id,
            toList: true,
            toShow: true,
            order: 1,
            required: true,
            help: "The first name",
            deleted: false
        },
        {
            name: "Last name",
            slug: "lname",
            fieldType: textType?._id,
            module: userModule._id,
            toList: true,
            toShow: true,
            order: 2,
            required: true,
            help: "The last name",
            deleted: false
        },
    ] as RequestField[]).map(createField));
}

if(process.argv && process.argv.length){
    config();
    db();
    const args = yargs.option('clear', {
        alias: 'c',
        type: 'boolean'
    }).argv;
    install(Boolean(args.clear));
}
