import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// `postgres()` connects lazily, so constructing the client with a missing
// DATABASE_URL is safe at build time — queries only run at request time.
const client = postgres(process.env.DATABASE_URL ?? "", { prepare: false });

export const db = drizzle(client, { schema });
