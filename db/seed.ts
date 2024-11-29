// this file was used to add data to the database. --@Qamar

// it is used to seed the database with sample data, the sample data contains users and products
// to seed run

//npx drizzle-kit push          this one creates any new schema we defined in the schema.ts file
// npx tsx ./db/seed            this on adds the actual data to the database

import { cwd } from 'node:process'
import { loadEnvConfig } from '@next/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema'
import sampleData from '@/lib/sample-data'
loadEnvConfig(cwd())

const main = async () => {
  try {
    const client = new Client({
      //dont use POSTGRES_URL use DATABASE_URL instead. This is defined in the .env file
      connectionString: process.env.POSTGRES_URL,
    })
    await client.connect()
    const db = drizzle(client)

    await db.delete(schema.accounts)
    await db.delete(schema.users)
    await db.delete(schema.products)

    const resUsers = await db
      .insert(schema.users)
      .values(sampleData.users)
      .returning()

    const resProducts = await db
      // insert into the table products the sample data
      .insert(schema.products)
      .values(sampleData.products)
      .returning()
    console.log({ resProducts, resUsers })
    await client.end()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}
main()
