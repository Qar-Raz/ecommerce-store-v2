'use server'

import { auth } from '@/auth'
import { getMyCart } from './cart.actions'
import { getUserById } from './user.actions'
import { redirect } from 'next/navigation'
import { insertOrderSchema } from '../validator'
import db from '@/db/drizzle'
import { carts, orderItems, orders } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { formatError } from '../utils'

// CREATE
export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')
    const cart = await getMyCart()
    const user = await getUserById(session?.user.id!)
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
    const insertedOrderId = await db.transaction(async (tx) => {
      const insertedOrder = await tx.insert(orders).values(order).returning()
      for (const item of cart.items) {
        await tx.insert(orderItems).values({
          ...item,
          price: item.price.toFixed(2),
          orderId: insertedOrder[0].id,
        })
      }
      await db
        .update(carts)
        .set({
          items: [],
          totalPrice: '0',
          shippingPrice: '0',
          taxPrice: '0',
          itemsPrice: '0',
        })
        .where(eq(carts.id, cart.id))
      return insertedOrder[0].id
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
