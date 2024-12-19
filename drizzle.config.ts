import { defineConfig } from "drizzle-kit"

import { serverEnv } from "./app/environment/server"

export default defineConfig({
	schema: "./app/server/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: serverEnv.DATABASE_URL
	}
})
