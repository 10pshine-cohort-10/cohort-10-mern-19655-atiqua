import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { createUser, findByEmail } from "../repositories/user.respository.js";
import type { User } from "../repositories/user.respository.js";
import logger from "../utils/logger.js";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}
export interface authResult {
  user: PublicUser;
  token: string;
}
const saltRounds = 10;
const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});
const createtoken = (userId: number): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ id: userId }, env.jwt.secret, options);
};
export const signUpUser = async (
  name: string,
  email: string,
  password: string,
): Promise<authResult> => {
  if (bcrypt.truncates(password)) {
    throw new ApiError(400, "Password is too long");
  }
  try {
    const existing = await findByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email already exists!");
    }
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await createUser(name, email, passwordHash);
    return { user: toPublicUser(user), token: createtoken(user.id) };
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      throw new ApiError(409, "Email already exists");
    }
    if (!(err instanceof ApiError)) {
      logger.error({ err }, "SignUp failed unexpectedly");
    }
    throw err;
  }
};
export const loginUser = async (
  email: string,
  password: string,
): Promise<authResult> => {
  if (bcrypt.truncates(password)) {
    throw new ApiError(400, "Password is too long");
  }
  try {
    const user = await findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !passwordMatches) {
      throw new ApiError(401, "Invalid email or password");
    }
    return { user: toPublicUser(user), token: createtoken(user.id) };
  } catch (err) {
    if (!(err instanceof ApiError)) {
      logger.error({ err }, "Login failed unexpectedly");
    }
    throw err;
  }
};
