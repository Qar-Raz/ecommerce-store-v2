import {
  getLatestProducts,
  getExpensiveProducts,
  getHighlyRatedProducts,
} from '@/lib/actions/product.actions'

import ProductDisplay from '@/components/shared/product/ProductDisplay'

export default async function Home() {
  const latestProducts = (await getLatestProducts()) as {
    id: string
    brand: string
    name: string
    slug: string
    category: string
    images: string[]
    description: string
    stock: number
    price: string
    rating: string
    numReviews: number
    isFeatured: boolean
    banner: string | null
    createdAt: Date
  }[]

  const expensiveProducts = (await getExpensiveProducts()) as {
    id: string
    brand: string
    name: string
    slug: string
    category: string
    images: string[]
    description: string
    stock: number
    price: string
    rating: string
    numReviews: number
    isFeatured: boolean
    banner: string | null
    createdAt: Date
  }[]

  const highlyRatedProducts = (await getHighlyRatedProducts()) as {
    id: string
    brand: string
    name: string
    slug: string
    category: string
    images: string[]
    description: string
    stock: number
    price: string
    rating: string
    numReviews: number
    isFeatured: boolean
    banner: string | null
    createdAt: Date
  }[]

  return (
    <ProductDisplay
      latestProducts={latestProducts}
      expensiveProducts={expensiveProducts}
      highlyRatedProducts={highlyRatedProducts}
    />
  )
}
