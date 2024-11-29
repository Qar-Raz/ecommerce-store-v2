//this 'use server' tag indicates that client shoudnt be able to run this file

'use server'
import { desc } from 'drizzle-orm'
import db from '@/db/drizzle'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm/sql'

export async function getLatestProducts() {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: 4,
  })
  return data
}

// this function will return a product by its slug if it is equal to the slug passed in the function --@Qamar
export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}
