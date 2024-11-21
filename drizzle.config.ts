import { cwd } from 'node:process'
import { loadEnvConfig } from '@next/env'
loadEnvConfig(cwd())
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  // this is the database credentials which come from the url defined in the .env file
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})
