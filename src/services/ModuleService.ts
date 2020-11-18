import { async } from "validate.js";

import { IModule } from "../models/Module";

export async function create(module: IModule){
    await async(module, {});
}