'use server'

import { auth } from '@/auth'
import { getMyCart } from './cart.actions'
import { redirect } from 'next/navigation'
import { insertOrderSchema } from '../validator'
import db from '@/db/drizzle'
import { sql } from 'drizzle-orm'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { formatError } from '../utils'
import { Cart } from '@/types'

// CREATE the order
export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const cart = (await getMyCart()) as Cart

    // Get user using raw SQL
    const userQuery = sql`
      SELECT * FROM "user"
      WHERE "id" = ${session.user.id}
      LIMIT 1
    `
    const userResult = await db.execute(userQuery)
    const user = userResult.rows[0]

    if (!user) throw new Error('User not found')
    if (!cart || cart.items.length === 0) redirect('/cart')
    if (!user.address) redirect('/shipping-address')
    if (!user.paymentMethod) redirect('/payment-method')

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    })

    // Start transaction
    const insertedOrderId = await db.transaction(async (tx) => {
      // Insert order
      const insertOrderQuery = sql`
        INSERT INTO "order" (
          "userId",
          "shippingAddress",
          "paymentMethod",
          "itemsPrice",
          "shippingPrice",
          "taxPrice",
          "totalPrice",
          "isPaid",
          "isDelivered",
          "createdAt"
        )
        VALUES (
          ${order.userId},
          ${JSON.stringify(order.shippingAddress)},
          ${order.paymentMethod},
          ${order.itemsPrice},
          ${order.shippingPrice},
          ${order.taxPrice},
          ${order.totalPrice},
          FALSE,
          FALSE,
          NOW()
        )
        RETURNING "id"
      `

      const orderResult = await tx.execute(insertOrderQuery)
      const insertedOrder = orderResult.rows[0]

      // Insert order items
      for (const item of cart.items) {
        const insertOrderItemQuery = sql`
          INSERT INTO "orderItems" (
            "orderId",
            "productId",
            "qty",
            "price",
            "name",
            "slug",
            "image"
          )
          VALUES (
            ${insertedOrder.id},
            ${item.productId},
            ${item.qty},
            ${item.price.toFixed(2)},
            ${item.name},
            ${item.slug},
            ${item.image}
          )
        `
        await tx.execute(insertOrderItemQuery)
      }

      // Clear cart
      const updateCartQuery = sql`
        UPDATE "cart"
        SET 
          "items" = '[]'::json,
          "totalPrice" = '0',
          "shippingPrice" = '0',
          "taxPrice" = '0',
          "itemsPrice" = '0'
        WHERE "id" = ${cart.id}
      `
      await tx.execute(updateCartQuery)

      return insertedOrder.id
    })

    if (!insertedOrderId) throw new Error('Order not created')
    redirect(`/order/${insertedOrderId}`)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: formatError(error) }
  }
}

export async function getOrderById(orderId: string) {
  // Fetch the order using raw SQL
  const orderResult = await db.execute(
    sql`
      SELECT 
        o.*, 
        u.name as "userName", 
        u.email as "userEmail",
        coalesce(
          json_agg(
            json_build_object(
              'orderId', oi."orderId",
              'productId', oi."productId",
              'qty', oi.qty,
              'price', oi.price,
              'name', oi.name,
              'slug', oi.slug,
              'image', oi.image
            )
          ) FILTER (WHERE oi."orderId" IS NOT NULL), '[]'
        ) as "orderItems"
      FROM "order" o
      JOIN "user" u ON o."userId" = u.id
      LEFT JOIN "orderItems" oi ON o.id = oi."orderId"
      WHERE o.id = ${orderId}
      GROUP BY o.id, u.name, u.email;
    `
  )

  const orderRow = orderResult.rows[0]
  if (!orderRow) throw new Error('Order not found')

  // Construct the order object
  const order = {
    id: orderRow.id,
    userId: orderRow.userId,
    shippingAddress: orderRow.shippingAddress,
    paymentMethod: orderRow.paymentMethod,
    paymentResult: orderRow.paymentResult,
    itemsPrice: orderRow.itemsPrice,
    shippingPrice: orderRow.shippingPrice,
    taxPrice: orderRow.taxPrice,
    totalPrice: orderRow.totalPrice,
    isPaid: orderRow.isPaid,
    paidAt: orderRow.paidAt,
    isDelivered: orderRow.isDelivered,
    deliveredAt: orderRow.deliveredAt,
    createdAt: orderRow.createdAt,
    user: {
      name: orderRow.userName,
      email: orderRow.userEmail,
    },
    orderItems: orderRow.orderItems,
  }

  return order
}
