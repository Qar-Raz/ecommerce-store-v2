import { carts, products } from '@/db/schema'
import { cartItemSchema, shippingAddressSchema } from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'
// PRODUCTS
export type Product = InferSelectModel<typeof products, { dbColumnNames: true }>

//CART

export type Cart = InferSelectModel<typeof carts>

// VALIDATOR index for zod schema
export type CartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
