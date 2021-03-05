// Auth.ts

import { AuthenticationError } from "apollo-server-errors";
import jwt from "jsonwebtoken";

export interface AuthResponse {
  isAuth: boolean;
  user: {
    id: string;
    permisions: string[];
  }
}

export default (request: any) => {
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

  // token decoded successfully, and extracted data
  return { isAuth: true, user: decodeToken } as AuthResponse;
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
