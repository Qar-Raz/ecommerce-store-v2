import { Metadata } from 'next'
import { auth } from '@/auth'
import { getUserById } from '@/lib/actions/user.actions'
import { APP_NAME } from '@/lib/constants'
import PaymentMethodForm from './payment-method-form'
import { ShippingAddress } from '@/types'
export const metadata: Metadata = {
  title: `Payment Method - ${APP_NAME}`,
}
export default async function PaymentMethodPage() {
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

  return <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
}
