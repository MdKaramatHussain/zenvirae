import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { CATEGORY_MAP, CATEGORIES } from '@/constants'

interface Params {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: Params) {
  const { category: raw } = (await params) as { category: string }
  const category = String(raw ?? '').toLowerCase()

  const products = CATEGORY_MAP[category] ?? null
  const categoryMeta = CATEGORIES.find((c) => c.slug === category) ?? null
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!categoryMeta || !products ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif font-bold mb-4">Category not found</h2>
              <p className="text-muted-foreground mb-6">We couldn't find the category you requested.</p>
              <Link href="/" className="inline-block">
                <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">Back to Home</button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <h1 className="font-serif text-3xl font-bold">{categoryMeta.title}</h1>
                <p className="text-sm text-muted-foreground">{products.length} items</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((p, index) => (
                //   <Link key={p.id} href={`/product/${p.id}`} className="block">
                    <ProductCard product={p} key={index} />
                //   </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
