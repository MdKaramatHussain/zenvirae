'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/store/cart-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    )
  }

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
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
            INR {product.price.toLocaleString()}
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
