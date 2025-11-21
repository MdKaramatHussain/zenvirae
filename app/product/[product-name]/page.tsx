/* Client-side actions component for Add to Cart / Buy Now */
'use client'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/cart-slice'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { CATEGORY_MAP, FEATURED_PRODUCTS, CATEGORIES } from '@/constants'
import { RootState } from '@/store/store'

export default function ProductPage() {
  const routeDetails = useSelector((state: RootState) => state.reduxRoute)
  const id = routeDetails?.id

  // Aggregate all products for lookup
  const allProducts = [
    ...FEATURED_PRODUCTS,
    ...Object.values(CATEGORY_MAP).flat(),
  ]

  const product = allProducts.find((p: any) => String(p.id) === String(id)) ?? null
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" key={id}>
        <Navbar />
        <main className="flex-1 py-15">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find the product you requested.</p>
            <Link href="/" className="inline-block">
              <button className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md">Back to Home</button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // determine category
  const category = product.category ?? (() => {
    for (const [k, arr] of Object.entries(CATEGORY_MAP)) {
      if (arr.find((x: any) => x.id === product.id)) return k
    }
    return null
  })()

  const similar = category ? (CATEGORY_MAP[category] ?? []).filter((p: any) => p.id !== product.id).slice(0, 5) : []

  return (
    <div className="min-h-screen flex flex-col" key={category}>
      <Navbar />
      <main className="flex-1 py-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="w-full bg-muted rounded-md overflow-hidden shadow-sm">
                <div className="relative w-full aspect-[4/5] bg-muted group">
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{product.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{category ? (CATEGORIES.find(c => c.slug === category)?.title ?? category) : 'Uncategorized'}</p>
              </div>

              <div className="prose max-w-none text-muted-foreground">
                <p>{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-serif text-3xl font-bold text-primary">₹ {Number(product.price).toLocaleString()}</p>
                <div className="text-sm text-muted-foreground">In stock</div>
              </div>

              <div>
                {/* Client-side actions */}
                {/* @ts-ignore */}
                <AddActions product={product} />
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-sm text-muted-foreground">Rating</h3>
                <div className="text-sm text-foreground">★★★★★ (4.8) — Trusted reviews</div>
              </div>
            </div>
          </div>

          {/* Similar products */}
          {similar.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Similar Products</h2>
                <Link href={`/category/${category}`} className="text-sm font-medium text-muted-foreground">See All</Link>
              </div>

              <div className="relative">
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 no-scrollbar snap-x snap-mandatory">
                  {similar.map((p: any) => (
                    <div key={p.id} className="min-w-[280px] md:min-w-[300px] lg:min-w-[260px] snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function AddActions({ product }: any) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = require('@/hooks/use-toast')

  const handleAdd = () => {
    dispatch(
      addToCart({ id: product.id, title: product.title, price: product.price, image: product.image })
    )
    try {
      toast({ title: 'Product added to cart successfully!', description: product.title, duration: 2500 })
    } catch {}
  }

  const handleBuyNow = () => {
    dispatch(
      addToCart({ id: product.id, title: product.title, price: product.price, image: product.image })
    )
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95">
        Add to Cart
      </Button>
      <Button onClick={handleBuyNow} className="flex-1 border border-border/40 bg-transparent text-foreground hover:bg-muted transition-transform active:scale-95">
        Buy Now
      </Button>
    </div>
  )
}
