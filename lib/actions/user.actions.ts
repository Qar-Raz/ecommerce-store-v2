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
import { ShippingAddress } from '@/types'
import { sql } from 'drizzle-orm'
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
      // Hash the password before storing it in the database
      password: hashSync(user.password, 10),
    }

    // Insert the new user using raw SQL
    await db.execute(
      sql`
        INSERT INTO "user" (
          id, name, email, password
        ) VALUES (
          ${values.id},
          ${values.name},
          ${values.email},
          ${values.password}
        )
      `
    )

    // Sign in the user after successful signup
    await signIn('credentials', {
      email: user.email,
      password: user.password,
    })

    return { success: true, message: 'User created successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    // Check if the email is already in the database
    return {
      success: false,
      message: formatError(error).includes(
        'duplicate key value violates unique constraint "user_email_idx"'
      )
        ? 'Email already exists'
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

// this is a function to delete the user
//is called when the profile button is clicked and the delete user dropdown is selected --@Qamar
export async function deleteUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  // Fetch the current user using raw SQL
  const currentUserResult = await db.execute(
    sql`
    SELECT * 
    FROM "user" 
    WHERE id = ${session.user.id}`
  )
  const currentUser = currentUserResult.rows[0]
  if (!currentUser) throw new Error('User not found')

  const userId = currentUser.id
  console.log('Current User ID:', userId) // Log the user ID

  // we dont need to delete foreign key reference for the other tables as the database
  // is set to cascade on delete while defining schema --@Qamar
  await db.execute(
    sql`
    DELETE FROM "user" 
    WHERE id = ${userId}`
  )

  // Sign out the current user
  await signOut()

  // Delete the current user from the database using the userId
}

// return the user by the id --@Qamar
// is a database query which is used for the shipping address part

export async function getUserById(userId: string) {
  // Fetch the user using a raw SQL query
  const userResult = await db.execute(
    sql`
    SELECT * 
    FROM "user" 
    WHERE id = ${userId}`
  )

  // Access the first row from the result
  const user = userResult.rows[0]

  if (!user) throw new Error('User not found')
  return user
}

// this is an update query which sets the shipping address of the user --@Qamar
// this field is null at first and is set which checking out
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Not authenticated')

    // Fetch the current user using raw SQL
    const currentUserResult = await db.execute(
      sql`
      SELECT * 
      FROM "user" 
      WHERE id = ${session.user.id}`
    )
    const currentUser = currentUserResult.rows[0]
    // error handling if the user is not found
    if (!currentUser) throw new Error('User not found')

    // Validate the shipping address
    const address = shippingAddressSchema.parse(data)

    // Serialize the address object to JSON string
    const addressJson = JSON.stringify(address)

    // Upsert the address in the addresses table
    await db.execute(
      sql`
        INSERT INTO address (user_id, address)
        VALUES (${currentUser.id}, ${addressJson}::jsonb)
        ON CONFLICT (user_id)
        DO UPDATE SET address = EXCLUDED.address
      `
    )

    // Update the user's address in the users table
    await db.execute(
      sql`
        UPDATE "user"
        SET address = ${addressJson}::jsonb
        WHERE id = ${currentUser.id}
      `
    )

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
      sql`
      SELECT * 
      FROM "user"
       WHERE id = ${session?.user.id!}
        LIMIT 1`
    )
    const currentUser = currentUserResult.rows[0]

    if (!currentUser) throw new Error('User not found')
    const paymentMethod = paymentMethodSchema.parse(data)

    await db.execute(
      sql`
      UPDATE "user"
       SET "paymentMethod" = ${paymentMethod.type}
        WHERE id = ${currentUser.id}`
    )

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
