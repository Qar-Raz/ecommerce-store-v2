import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ShippingAddressForm from './shipping-address-form'
import { Cart, ShippingAddress } from '@/types'
export const metadata: Metadata = {
  title: `Shipping Address - ${APP_NAME}`,
}
export default async function ShippingPage() {
  const cart = (await getMyCart()) as Cart
  if (!cart || cart.items.length === 0) redirect('/cart')

  const session = await auth()

  const user = (await getUserById(session?.user.id!)) as {
    id: string
    name: string | null
    email: string
    role: string
    password: string | null
    emailVerified: Date | null
    image: string | null
    address: ShippingAddress | null
    paymentMethod: string | null
  }

  return <ShippingAddressForm address={user.address} />
}
