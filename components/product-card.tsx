'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/store/cart-slice'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { addroute } from '@/store/route-slice'
import { toastDuration } from '@/constants'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  createdAt: string
  popularity: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    )
    try {
      toast.success({
        title: 'Product added to cart successfully!',
        description: product.title,
        duration: toastDuration,
      })
    } catch (err) {
      // graceful fallback
    }
  }
  const handleNavigate = () => {
    dispatch(
      addroute({
        id: product.id,
        category: product.category,
      })
    )
    product.title = product.title.replace(/\s+/g, '-').toLowerCase();
    router.push(`/product/${product.title}`)
  }

  return (
    <Card
      onClick={handleNavigate}
      className="group overflow-visible border-border transition-shadow duration-300 cursor-pointer flex flex-col shadow-sm md:group-hover:shadow-xl"
      role="button"
    >
      {/* inner scaled wrapper: keeps layout cells same size while visually reducing card to 80% */}
      <div className="w-full flex justify-center items-start md:h-105">
        <div className="transform-gpu transition-transform duration-300 ease-out scale-92 md:scale-[0.82] md:group-hover:scale-[0.86] origin-top w-full">
          <CardContent className="p-0 overflow-hidden">
            <div className="relative overflow-hidden bg-muted aspect-3/4 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 px-3 py-2">
            <div className="w-full">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-0.5 text-balance line-clamp-2">
                {product.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                {product.description.length > 30 ? product.description.slice(0, 30) + '...' : product.description}
              </p>
              <p className="font-serif text-xl font-bold text-primary mt-1">
                ₹ {product.price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              type="button"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
