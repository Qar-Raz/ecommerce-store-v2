import { getOrderById } from '@/lib/actions/order.actions'
import { APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'
import OrderDetailsForm from './order-details-form'
import { Order } from '@/types'
export const metadata = {
  title: `Order Details - ${APP_NAME}`,
}
const OrderDetailsPage = async ({
  params: { id },
}: {
  params: {
    id: string
  }
}) => {
  const order = (await getOrderById(id)) as Order
  if (!order) notFound()
  order.user
  return <OrderDetailsForm order={order} />
}
export default OrderDetailsPage
