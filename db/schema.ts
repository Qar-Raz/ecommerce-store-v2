// drizzle orm allows us define queries and tables of postgres sql in typescript. --@Qamar
// it is used in conjuction with Zod which handles data validation
// this is advantageous because it allows type safety, that data types of the code matches the types of the database
// IMP to note that Zod is not used to interact with the database, but drizzle is used to make tables and queries

import { CartItem, ShippingAddress } from '@/types'
import {
  boolean,
  integer,
  json,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { primaryKey } from 'drizzle-orm/pg-core/primary-keys'
import { AdapterAccountType } from 'next-auth/adapters'

// USERS
export const users = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name'),
  email: text('email').notNull(),
  role: text('role').notNull().default('user'),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

// ADDRESS
export const addresses = pgTable('address', {
  userId: uuid('user_id')
    .references(() => users.id)
    .primaryKey(),
  address: json('address').$type<ShippingAddress>(),
})

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

// sessions and verification tokens tables are not created by me but by next-auth --@Qamar
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

// PRODUCTS
export const products = pgTable(
  'product',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category: text('category').notNull(),
    images: text('images').array().notNull(),
    brand: text('brand').notNull(),
    description: text('description').notNull(),
    stock: integer('stock').notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
    rating: numeric('rating', { precision: 3, scale: 2 })
      .notNull()
      .default('0'),
    numReviews: integer('numReviews').notNull().default(0),
    isFeatured: boolean('isFeatured').default(false).notNull(),
    banner: text('banner'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => {
    return {
      productSlugIdx: uniqueIndex('product_slug_idx').on(table.slug),
    }
  }
)

// CARTS schema
export const carts = pgTable('cart', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  sessionCartId: text('sessionCartId').notNull(),
  //postgres allows for arrays of json objects --@Qamar
  // we use the json type to store the cart items which is an array of all the items hence json is used here
  items: json('items').$type<CartItem[]>().notNull().default([]),
  itemsPrice: numeric('itemsPrice', { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric('shippingPrice', {
    precision: 12,
    scale: 2,
  }).notNull(),
  taxPrice: numeric('taxPrice', { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
