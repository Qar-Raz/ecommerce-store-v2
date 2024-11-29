import * as z from 'zod'
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
