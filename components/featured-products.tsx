'use client'

import { FEATURED_PRODUCTS } from '@/constants'
import { ProductCard } from './product-card'

export function FeaturedProducts() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Featured Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of timeless pieces crafted with exceptional attention to detail
          </p>
        </div>

        {/* Desktop: 4 cards in a row */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 xl:gap-8">
          {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Tablet: 2 cards in a row */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile: 1 card at a time with horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-4">
            {FEATURED_PRODUCTS.slice(0, 4).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Additional products on larger screens */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 xl:gap-8 mt-6 xl:mt-8">
          {FEATURED_PRODUCTS.slice(4, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
