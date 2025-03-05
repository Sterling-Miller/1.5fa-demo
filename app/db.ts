import { drizzle } from "drizzle-orm/postgres-js";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string) {
  const users = await ensureTableExists();
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  const users = await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}

async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(64),
        password VARCHAR(64)
      );`;
  }

  const table = pgTable("User", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 64 }),
    password: varchar("password", { length: 64 }),
  });

  return table;
}

// Function to insert token into the Tokens table
export async function insertToken(
  token: string,
  createdat: Date,
  expiresat: Date,
  used: boolean
) {
  await ensureTokensTableExists();
  await db.insert(tokensTable).values({ token, createdat, expiresat, used });
}

// Function to ensure the Tokens table exists
async function ensureTokensTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Tokens'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE "Tokens" (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64),
        createdat TIMESTAMP,
        expiresat TIMESTAMP,
        used BOOLEAN
      );`;
  }
}

// Tokens table definition
const tokensTable = pgTable("Tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 64 }),
  createdat: timestamp("createdat"),
  expiresat: timestamp("expiresat"),
  used: boolean("used"),
});
