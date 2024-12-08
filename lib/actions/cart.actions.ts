'use server'
import { auth } from '@/auth'
import db from '@/db/drizzle'

import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { cartItemSchema } from '../validator'
import { formatError, round2 } from '../utils'
import { Cart, CartItem, Product } from '@/types'
import { revalidatePath } from 'next/cache'

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export const addItemToCart = async (data: CartItem) => {
  try {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart Session not found')

    const session = await auth()
    const userId = session?.user.id as string | undefined // Make userId optional
    const cart = (await getMyCart()) as Cart
    const item = cartItemSchema.parse(data)

    // Check if product exists using raw SQL
    const productQuery = sql`
      SELECT * FROM "product" 
      WHERE "id" = ${item.productId} 
      LIMIT 1
    `
    const productResult = await db.execute(productQuery)
    const productRows = productResult.rows[0]

    if (!productRows) throw new Error('Product not found')

    const product = {
      id: productRows.id,
      brand: productRows.brand,
      name: productRows.name,
      slug: productRows.slug,
      category: productRows.category,
      images: productRows.images,
      description: productRows.description,
      stock: productRows.stock,
      price: productRows.price,
      rating: productRows.rating,
      numReviews: productRows.numReviews,
      isFeatured: productRows.isFeatured,
      banner: productRows.banner,
      createdAt: productRows.createdAt,
    } as Product

    if (!cart) {
      // Create new cart if product has stock
      if (product.stock < 1) throw new Error('Not enough stock')

      const prices = calcPrice([item])
      const insertQuery = sql`
        INSERT INTO "cart" (
          "userId",
          "sessionCartId",
          "items",
          "itemsPrice",
          "shippingPrice",
          "taxPrice",
          "totalPrice"
        )
        VALUES (
          ${userId || null},  -- Handle null userId for non-authenticated users
          ${sessionCartId},
          ${JSON.stringify([item])},
          ${prices.itemsPrice},
          ${prices.shippingPrice},
          ${prices.taxPrice},
          ${prices.totalPrice}
        )
        RETURNING *  -- Add RETURNING to confirm insertion
      `

      await db.execute(insertQuery)
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: 'Item added to cart successfully',
      }
    } else {
      // Update existing cart
      const existItem = cart.items.find((x) => x.productId === item.productId)
      let updatedItems

      if (existItem) {
        if (product.stock < existItem.qty + 1)
          throw new Error('Not enough stock')
        updatedItems = cart.items.map((x) =>
          x.productId === item.productId ? { ...x, qty: x.qty + 1 } : x
        )
      } else {
        if (product.stock < 1) throw new Error('Not enough stock')
        updatedItems = [...cart.items, item]
      }

      const prices = calcPrice(updatedItems)
      const updateQuery = sql`
        UPDATE "cart"
        SET 
          "items" = ${JSON.stringify(updatedItems)},
          "itemsPrice" = ${prices.itemsPrice},
          "shippingPrice" = ${prices.shippingPrice},
          "taxPrice" = ${prices.taxPrice},
          "totalPrice" = ${prices.totalPrice}
        WHERE "id" = ${cart.id}
        RETURNING *  -- Add RETURNING to confirm update
      `

      await db.execute(updateQuery)
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart successfully`,
      }
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export async function getMyCart() {
  const sessionCartId = cookies().get('sessionCartId')?.value
  if (!sessionCartId) return undefined

  const session = await auth()
  const userId = session?.user.id

  // The query changes based on whether we have a userId or not
  const cartQuery = userId
    ? sql`
        SELECT * FROM "cart"
        WHERE "userId" = ${userId}
        LIMIT 1
      `
    : sql`
        SELECT * FROM "cart"
        WHERE "sessionCartId" = ${sessionCartId}
        LIMIT 1
      `

  const result = await db.execute(cartQuery)
  return result.rows[0] || undefined
}
export const removeItemFromCart = async (productId: string) => {
  try {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart Session not found')

    // Get product using raw SQL
    const productQuery = sql`
      SELECT * FROM "product" 
      WHERE "id" = ${productId}
      LIMIT 1
    `
    const productResult = await db.execute(productQuery)
    const productRows = productResult.rows[0]

    if (!productRows) throw new Error('Product not found')

    const product = {
      id: productRows.id,
      brand: productRows.brand,
      name: productRows.name,
      slug: productRows.slug,
      category: productRows.category,
      images: productRows.images,
      description: productRows.description,
      stock: productRows.stock,
      price: productRows.price,
      rating: productRows.rating,
      numReviews: productRows.numReviews,
      isFeatured: productRows.isFeatured,
      banner: productRows.banner,
      createdAt: productRows.createdAt,
    } as Product

    const cart = (await getMyCart()) as Cart
    if (!cart) throw new Error('Cart not found')

    const exist = cart.items.find((x) => x.productId === productId)
    if (!exist) throw new Error('Item not found')

    let updatedItems
    if (exist.qty === 1) {
      // Remove item completely if qty is 1
      updatedItems = cart.items.filter((x) => x.productId !== exist.productId)
    } else {
      // Decrease quantity by 1
      updatedItems = cart.items.map((x) =>
        x.productId === productId ? { ...x, qty: x.qty - 1 } : x
      )
    }

    const prices = calcPrice(updatedItems)

    // Update cart using raw SQL
    const updateQuery = sql`
      UPDATE "cart"
      SET 
        "items" = ${JSON.stringify(updatedItems)},
        "itemsPrice" = ${prices.itemsPrice},
        "shippingPrice" = ${prices.shippingPrice},
        "taxPrice" = ${prices.taxPrice},
        "totalPrice" = ${prices.totalPrice}
      WHERE "id" = ${cart.id}
      RETURNING *
    `

    await db.execute(updateQuery)

    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} ${
        updatedItems.find((x) => x.productId === productId)
          ? 'updated in'
          : 'removed from'
      } cart successfully`,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
