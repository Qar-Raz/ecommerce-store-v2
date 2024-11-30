import { carts, products } from '@/db/schema'
import { cartItemSchema } from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'
// PRODUCTS
export type Product = InferSelectModel<typeof products, { dbColumnNames: true }>

//CART

// ? dont get why we use z(zod here) --@Qamar
export type Cart = InferSelectModel<typeof carts>
export type CartItem = z.infer<typeof cartItemSchema>
