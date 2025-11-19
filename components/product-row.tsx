import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
}

interface ProductRowProps {
  title: string
  products: Product[]
  link: string
}

export function ProductRow({ title, products, link }: ProductRowProps) {
  return (
    // <section className="py-12 border-b border-border/40">
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          <Button variant="ghost" asChild className="group">
            <Link href={link} className="flex items-center gap-2 text-sm font-medium">
              See All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 no-scrollbar snap-x snap-mandatory">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="min-w-[280px] md:min-w-[300px] lg:min-w-[260px] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
