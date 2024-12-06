'use server'

// here we are importing the signIn and signOut functions from the auth file
// we then import the signInFormSchema from the validator file
//we then create a function called signInWithCredentials that uses
// the schema from zod and the sign in function from auth to sign in the user
// else give the invalid email or password message ----@Qamar

import { isRedirectError } from 'next/dist/client/components/redirect'
import { auth, signIn, signOut } from '@/auth'
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '../validator'
import { formatError } from '../utils'
import { hashSync } from 'bcrypt-ts-edge'
import db from '@/db/drizzle'
import { addresses, users } from '@/db/schema'
import { ShippingAddress } from '@/types'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// this is for the sign up form schema --@Qamar
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    })
    const values = {
      id: crypto.randomUUID(),
      ...user,
      // we hash the password before storing it in the database(just extra security) --@Qamar
      password: hashSync(user.password, 10),
    }
    await db.insert(users).values(values)
    await signIn('credentials', {
      email: user.email,
      password: user.password,
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    //this block of code checks if the email is already in the database --@Qamar
    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? 'Email is already exist'
        : formatError(error),
    }
  }
}

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    await signIn('credentials', user)
    return { success: true, message: 'Sign in successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

// here we are exporting the signOut function from the auth file --@Qamar
export const SignOut = async () => {
  await signOut()
}

// return the user by the id --@Qamar
// is a database query which is used for the shipping address part
export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
  if (!user) throw new Error('User not found')
  return user
}

// this is an update query which sets the shipping address of the user --@Qamar
// this field is null at first and is set which checking out
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Not authenticated')

    const currentUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.id as string),
    })
    if (!currentUser) throw new Error('User not found')

    // Validate the shipping address
    const address = shippingAddressSchema.parse(data)

    // Check if user already has an address
    const existingAddress = await db.query.addresses.findFirst({
      where: (addresses, { eq }) => eq(addresses.userId, currentUser.id),
    })

    if (existingAddress) {
      // Update existing address
      await db
        .update(addresses)
        .set({ address })
        .where(eq(addresses.userId, currentUser.id))

      // update the user address in the user table --@Qamar
      await db
        .update(users)
        .set({ address })
        .where(eq(users.id, currentUser.id))
    } else {
      // Create new address record
      await db.insert(addresses).values({
        userId: currentUser.id,
        address,
      })

      // update the user address in the user table --@Qamar
      await db
        .update(users)
        .set({ address })
        .where(eq(users.id, currentUser.id))
    }

    revalidatePath('/place-order')
    return {
      success: true,
      message: 'Address updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

//has been converted to use raw sql query --@Qamar
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    // first line is to access the session
    const session = await auth()
    //get the current user

    const currentUserResult = await db.execute(
      sql`SELECT * FROM "user" WHERE id = ${session?.user.id!} LIMIT 1`
    )
    const currentUser = currentUserResult.rows[0]

    if (!currentUser) throw new Error('User not found')
    const paymentMethod = paymentMethodSchema.parse(data)

    await db.execute(
      sql`UPDATE "user" SET "paymentMethod" = ${paymentMethod.type} WHERE id = ${currentUser.id}`
    )

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
