import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;
import {
  POSTGRES_DB_ENDPOINT,
  POSTGRES_DB_NAME,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
  POSTGRES_DB_USERNAME,
} from "./conn.js";

export const pgConfig = {
  user: POSTGRES_DB_USERNAME,
  host: POSTGRES_DB_ENDPOINT,
  password: POSTGRES_DB_PASSWORD,
  port: POSTGRES_DB_PORT,
  database: POSTGRES_DB_NAME,
};
export const pooldb = new Pool(pgConfig);
