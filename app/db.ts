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
  used: boolean,
  browser: string,
  os: string
) {
  await ensureTokensTableExists();
  console.log("Token inserted:", { token, createdat, expiresat, used, browser, os });
  await db.insert(tokensTable).values({ token, createdat, expiresat, used, browser, os });
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
        used BOOLEAN,
        browser VARCHAR(10),
        os VARCHAR(10)
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
  browser: varchar("browser", { length: 10 }),
  os: varchar("os", { length: 10 }),
});


// Stub functions for database token operations

export async function getTokenByValue(token: string) {
  await ensureTokensTableExists();
  try {
    const result = await db.select().from(tokensTable).where(eq(tokensTable.token, token));
    console.log("Fetching token:", token);
    if (result.length > 0) {
      return result[0];
    } else {
      console.error("Token not found:", token);
      return null;
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    throw new Error("Failed to fetch token");
  }
}

export async function markTokenAsUsed(token: string) {
  // Update token status in database (replace with actual DB update)
  await ensureTokensTableExists();
  await db.update(tokensTable).set({ used: true }).where(eq(tokensTable.token, token));
  console.log("Token marked as used:", token);
}
