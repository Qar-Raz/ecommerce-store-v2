// this is the validator section of the code. --@Qamar
// we use it to define schema which are in typescript
// ZOD is used to ensure that the data is of a valid type
// Raw SQL cannot validate data input at runtime in your application hence we use zod to validate the data
// zod is used to validate data at the application layer before it touches the database
// in our case it is used to validate form inputs

import * as z from 'zod'
import { formatNumberWithDecimal } from './utils'
import { DEFAULT_PAYMENT_METHOD } from './constants'

// schema for signInForm --@Qamar
export const signInFormSchema = z.object({
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
})

//schema for signUpForm --@Qamar
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    confirmPassword: z
      .string()
      .min(3, 'Confirm password must be at least 3 characters'),
  })

  // this for the password match to see if both password fields match--@Qamar
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword'],
  })

// CART schema --@Qamar
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      'Price must have exactly two decimal places (e.g., 49.99)'
    ),
})

// Shipping Address schema(use the zod z object) --@Qamar
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

// Schema for Payment Method --@Qamar
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => DEFAULT_PAYMENT_METHOD.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  })
