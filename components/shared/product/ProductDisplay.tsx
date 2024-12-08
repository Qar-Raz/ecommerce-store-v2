'use client'

import { useState } from 'react'
import ProductList from '@/components/shared/product/product-list'
import DropdownMenuClient from '@/components/shared/product/DropdownMenuClient'

export default function ProductDisplay({
  latestProducts,
  expensiveProducts,
  highlyRatedProducts,
}: {
  latestProducts: any[]
  expensiveProducts: any[]
  highlyRatedProducts: any[]
}) {
  const [selectedProducts, setSelectedProducts] = useState(latestProducts)
  const [title, setTitle] = useState('Latest Products')

  const handleSelection = (type: string) => {
    switch (type) {
      case 'latest':
        setSelectedProducts(latestProducts)
        setTitle('Latest Products')
        break
      case 'expensive':
        setSelectedProducts(expensiveProducts)
        setTitle('Expensive Products')
        break
      case 'highlyRated':
        setSelectedProducts(highlyRatedProducts)
        setTitle('Highly Rated Products')
        break
      default:
        setSelectedProducts(latestProducts)
        setTitle('Latest Products')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold">{title}</h1>

        {/* Dropdown Menu */}
        <DropdownMenuClient onSelect={handleSelection} />
      </div>

      {/* Product List */}
      <ProductList title={title} data={selectedProducts} />
    </div>
  )
}
