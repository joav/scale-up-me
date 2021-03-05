import { IResolvers } from "apollo-server-express";
import Role from "../models/Role";

export default ({
    Query: {
        async getRoles() {
            return Role.find();
        }
    }
} as IResolvers);