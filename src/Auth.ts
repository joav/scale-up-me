// Auth.ts

import { AuthenticationError } from "apollo-server-errors";
import jwt from "jsonwebtoken";
import { concat, some, uniqBy } from "lodash";
import { PermisionDocument } from "./models/Permision";
import { getById } from "./services/UserService";

export interface AuthResponse {
  isAuth: boolean;
  user: {
    id: string;
    permisions: string[];
  }
}

export default async (request: any) => {
  const header = request.req.headers.authorization;

  // not found
  if (!header) return { isAuth: false };

  // token
  const [,token]: any = header.split(" ");

  // token not found
  if (!token) return { isAuth: false };

  let decodeToken: any;

  try {
    decodeToken = jwt.verify(token, process.env.SECRET || "");
  } catch (err) {
    return { isAuth: false };
  }

  // in case any error found
  if (!!!decodeToken) return { isAuth: false };

  const user = await getById(decodeToken.id, true, false);
  const rolePermisions: PermisionDocument[] = user?.role.permisions;
  let permisions = [];
  if(some(rolePermisions, p => p.slug === "unrestricted")) permisions.push("unrestricted");
  else permisions = uniqBy(concat(rolePermisions, user?.customPermisions as PermisionDocument[]), p => p._id.toString()).map(p => p.slug || "" );

  // token decoded successfully, and extracted data
  return { isAuth: true, user: {...decodeToken, permisions} } as AuthResponse;
};

const signedIn = (context: AuthResponse): boolean => context.isAuth

export const ensureSignedIn = (context: AuthResponse): void => {
  if (!signedIn(context)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const ensureSignedOut = (context: AuthResponse): void => {
  if (signedIn(context)) {
    throw new AuthenticationError('You are already signed in.')
  }
}
