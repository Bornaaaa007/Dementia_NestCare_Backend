import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { MongoClient } from "mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017/database",
);
export const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  baseURL: "http://localhost:5000",
  secret: process.env.BETTER_AUTH_SECRET || "your-super-secret-key-change-this",
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
  "http://localhost:8081",
  "http://192.168.1.6:8081",
  "exp://192.168.1.6:8081",
  "dementianestcare://", // must match the scheme in app.json exactly
],
  plugins: [expo()],
});