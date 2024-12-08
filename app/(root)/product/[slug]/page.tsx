import { notFound } from 'next/navigation'

import ProductImages from '@/components/shared/product/product-images'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug } from '@/lib/actions/product.actions'
import { APP_NAME } from '@/lib/constants'

import AddToCart from '@/components/shared/product/add-to-cart'
import { getMyCart } from '@/lib/actions/cart.actions'
import { round2 } from '@/lib/utils'
import { Cart } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description,
  }
}

const ProductDetails = async ({
  params: { slug },
}: {
  params: { slug: string }
  searchParams: { page: string; color: string; size: string }
}) => {
  // need to type cast the product returned by the getProductBySlug function as it is a raw sql query
  // defined in the user actions file
  const product = (await getProductBySlug(slug)) as {
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
  }

  if (!product) notFound()

  const cart = (await getMyCart()) as Cart

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images!} />
          </div>

          <div className="col-span-2 flex flex-col w-full  gap-8 p-5">
            <div className="flex flex-col gap-6">
              <p className="p-medium-16 rounded-full bg-grey-500/10   text-grey-500">
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <ProductPrice
                    value={Number(product.price)}
                    className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700"
                  />
                </div>
              </div>
            </div>

            <div>
              <p>Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </div>
                {product.stock !== 0 && (
                  <div className=" flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: round2(product.price),
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetails
