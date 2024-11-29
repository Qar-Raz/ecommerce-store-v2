export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Amazona'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Ecommerce Website Made For Databases Project'

// this is to set the default password for the website --@Qamar
export const signInDefaultValues = {
  email: '',
  password: '',
}

// these are the default values for the sign up form --@Qamar
export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
