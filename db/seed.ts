// this file was used to add data to the database. --@Qamar

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
    await db.delete(schema.products)
    const resProducts = await db
      // insert into the table products the sample data
      .insert(schema.products)
      .values(sampleData.products)
      .returning()
    console.log({ resProducts })
    await client.end()
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}
main()
