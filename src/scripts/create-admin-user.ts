// DEPS
import  { config } from "dotenv";
import yargs from 'yargs';
// Services
// Models
// Utils
import db from '../db';
import { getModuleBySlug } from "../services/ModuleService";
import { createUserWithUsername } from "../services/UserService";

async function createAdminUser(username: string | undefined, password: string | undefined) {
    if(username && password) {
        try {
            if(!(await getModuleBySlug('user'))) throw new Error("Not installed");
            await createUserWithUsername(username, password, "SUPER-ADMIN");
            console.log(`User: ${username}. Created!`);
        } catch (error) {
            console.log('error', error);
        }
    }else{
        console.log("Not data for create");
    }
    process.exit();
}

if(process.argv && process.argv.length){
    config();
    db();

    const args = yargs.option('usermane', {
        alias: 'u',
        type: 'string'
    }).option('password', {
        alias: 'p',
        type: 'string'
    }).argv;
    createAdminUser(args.usermane, args.password);
}