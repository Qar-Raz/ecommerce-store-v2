export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Amazon'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Ecommerce Website Made For Databases Project'

// default payment methods --@Qamar
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'CashOnDelivery'

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

// default values for the shipping address form --@Qamar
export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
}
