"use server";
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

// Function to get user from the User table
export async function getUser(email: string) {
  const users = await ensureTableExists();
  return await db.select().from(users).where(eq(users.email, email));
}

// Function to create a user in the User table
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
  activated: boolean,
  used: boolean,
  useremail: string,
  browser: string,
  os: string
) {
  await ensureTokensTableExists();
  console.log("Tokens table exists");
  await db.insert(tokensTable).values({ token, createdat, expiresat, activated, used, useremail, browser, os });
}

// Function to get all the data from a token in the Tokens table
export async function getTokenData(token: string) {
  await ensureTokensTableExists();
  return await db.select().from(tokensTable).where(eq(tokensTable.token, token));
}


// Function to "activate" a token in the Tokens table
export async function activateToken(token: string, useremail: string) {
  // Update the activated field to true and set the user to the provided user
  await ensureTokensTableExists();
  await verifyToken(token);
  await db.update(tokensTable).set({ activated: true, useremail }).where(eq(tokensTable.token, token));
}

// Fucntion to check if token is activated
export async function isTokenActivated(token: string) {
  await ensureTokensTableExists();
  const tokens = await db.select().from(tokensTable).where(eq(tokensTable.token, token));
  return tokens.length > 0 ? tokens[0].activated : null;
}

// Function to verify a token in the Tokens table
export async function verifyToken(token: string) {
  await ensureTokensTableExists();
  const tokens = await db.select().from(tokensTable).where(eq(tokensTable.token, token));
  return tokens.length > 0;
}

// Function to get the email from a token in the Tokens table
export async function getEmailFromToken(token: string) {
  await ensureTokensTableExists();
  const tokens = await db.select().from(tokensTable).where(eq(tokensTable.token, token));
  return tokens.length > 0 ? tokens[0].useremail : null;
}

// Function to delete a token from the Tokens table
export async function deleteToken(token: string) {
  await ensureTokensTableExists();
  await db.delete(tokensTable).where(eq(tokensTable.token, token));
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
    console.log("Creating Tokens table");
    await client`
      CREATE TABLE "Tokens" (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64),
        createdat TIMESTAMP,
        expiresat TIMESTAMP,
        activated BOOLEAN,
        used BOOLEAN,
        useremail VARCHAR(64),
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
  activated: boolean("activated"),
  used: boolean("used"),
  useremail: varchar("useremail", { length: 64 }),
  browser: varchar("browser", { length: 10 }),
  os: varchar("os", { length: 10 }),
});
