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

export function ProductCardSm({ product }: ProductCardProps) {
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
        title: 'Product added to cart',
        description: product.title,
        duration: toastDuration,
      })
    } catch (err) {}
  }
  const handleNavigate = () => {
    dispatch(
      addroute({
        id: product.id,
        category: product.category,
      })
    )
    const slug = product.title.replace(/\s+/g, '-').toLowerCase()
    router.push(`/product/${slug}`)
  }

  return (
    <Card
      onClick={handleNavigate}
      className="group overflow-hidden border-border transition-shadow duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-md"
      role="button"
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-muted aspect-3/4 w-full">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 px-3 py-2">
        <div className="w-full">
          <h4 className="font-serif text-sm font-semibold text-foreground mb-0.5 line-clamp-2">
            {product.title}
          </h4>
          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
            ₹ {product.price.toLocaleString()}
          </p>
        </div>
        <Button onClick={handleAddToCart} type="button" className="w-full text-sm">
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
