import dotenv from "dotenv";

dotenv.config();

interface Env {
  port: number;
  nodeEnv: string;
  logLevel: string;
}
export const env: Env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};
