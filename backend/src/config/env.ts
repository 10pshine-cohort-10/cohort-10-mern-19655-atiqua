import dotenv from "dotenv";

dotenv.config();

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if(!value){
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
interface DbEnv {
  host: string
  port: number
  name: string
  user: string
  password: string
}
interface JwtEnv{
  secret: string;
  expiresIn: string;
}
interface Env {
  port: number;
  nodeEnv: string;
  logLevel: string;
  db: DbEnv;
  jwt: JwtEnv
}
const JWT_Expires_PATTERN = /^\d+(ms|s|m|h|d|w|y)$/;
const readJwtExpiresIn = (): string => {
  const val = process.env.JWT_EXPIRES_IN || '1d'
  if(!JWT_Expires_PATTERN.test(val)){
    throw new Error(
      `Invalid JWT_EXPIRES_IN "${val}". Use a number with a unit, like 30m, 12h or 1d`
    )
  }
  return val
}
export const env: Env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  db: {
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT')),
    name: requireEnv('DB_NAME'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD')
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: readJwtExpiresIn()
  }  
};
