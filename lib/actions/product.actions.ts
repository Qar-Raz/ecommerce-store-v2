//this 'use server' tag indicates that client shoudnt be able to run this file

'use server'

import db from '@/db/drizzle'
import { sql } from 'drizzle-orm'

export async function getLatestProducts() {
  const query = sql`
  SELECT *
   FROM product
    ORDER BY "createdAt"
     DESC;`
  const data = await db.execute(query)
  return data.rows
}

export async function getExpensiveProducts() {
  const query = sql`
  SELECT * 
  FROM product
   ORDER BY "price"
    DESC;`
  const data = await db.execute(query)
  return data.rows
}

export async function getHighlyRatedProducts() {
  const query = sql`
  SELECT *
   FROM product
    ORDER BY "rating"
     DESC;`
  const data = await db.execute(query)
  return data.rows
}

// this function will return a product by its slug if it is equal to the slug passed in the function --@Qamar
export async function getProductBySlug(slug: string) {
  const query = sql`
  SELECT * 
  FROM product
   WHERE slug
    = ${slug}
     LIMIT 1;`
  const result = await db.execute(query)
  return result.rows[0]
}
