'use client'

import React from 'react'
import { ProductCardSm } from './product-card-sm'

interface ProductItem {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

interface Props {
  items: ProductItem[]
}

export default function ProductGrid({ items }: Props) {
  if (!items.length) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">No results found. Try adjusting filters or search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
      {items.map((p) => (
        <ProductCardSm key={p.id} product={p} />
      ))}
    </div>
  )
}
