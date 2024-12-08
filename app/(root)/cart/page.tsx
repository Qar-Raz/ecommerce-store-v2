import { getMyCart } from '@/lib/actions/cart.actions'
import CartForm from './cart-form'
import { APP_NAME } from '@/lib/constants'
import { Cart } from '@/types'
export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
}
export default async function CartPage() {
  const cart = (await getMyCart()) as Cart
  return <CartForm cart={cart} />
}
