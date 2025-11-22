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
      className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
      role="button"
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 text-balance">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <p className="font-serif text-xl font-bold text-primary">
            ₹ {product.price.toLocaleString()}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
