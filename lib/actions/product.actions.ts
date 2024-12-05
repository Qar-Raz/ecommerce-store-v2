//this 'use server' tag indicates that client shoudnt be able to run this file

'use server'
import { desc } from 'drizzle-orm'
import db from '@/db/drizzle'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm/sql'

import { sql } from 'drizzle-orm'

export async function getLatestProducts() {
  const query = sql`SELECT * FROM product;`
  const data = await db.execute(query)
  return data.rows
}

export async function getExpensiveProducts() {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.price)], // Sorting by price in descending order
    limit: 4, // Limiting the result to 4 products
  })
  return data
}

export async function getHighlyRatedProducts() {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.rating)], // Sorting by price in descending order
    limit: 4, // Limiting the result to 4 products
  })
  return data
}

// this function will return a product by its slug if it is equal to the slug passed in the function --@Qamar
export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}
