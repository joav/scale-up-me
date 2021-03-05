import { IResolvers } from "apollo-server-express";
import Permision from "../models/Permision";

export default ({
    Query: {
        async getPermisions() {
            return Permision.find();
        }
    }
} as IResolvers);