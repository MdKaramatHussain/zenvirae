import { Navbar } from '@/components/navbar'
import { HeroCarousel } from '@/components/hero-carousel'
import { FeaturedProducts } from '@/components/featured-products'
import { ProductRow } from '@/components/product-row'
import { Footer } from '@/components/footer'
import { 
  MENS_PRODUCTS, 
  WOMENS_PRODUCTS, 
  SHOES_PRODUCTS, 
  JEWELLERY_PRODUCTS, 
  ESSENTIALS_PRODUCTS 
} from '@/constants'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroCarousel />
        <FeaturedProducts />
        
        <ProductRow 
          title="Men's Clothing" 
          products={MENS_PRODUCTS} 
          link="/category/mens" 
        />
        
        <ProductRow 
          title="Women's Clothing" 
          products={WOMENS_PRODUCTS} 
          link="/category/womens" 
        />
        
        <ProductRow 
          title="Shoes" 
          products={SHOES_PRODUCTS} 
          link="/category/shoes" 
        />
        
        <ProductRow 
          title="Jewellery" 
          products={JEWELLERY_PRODUCTS} 
          link="/category/jewellery" 
        />
        
        <ProductRow 
          title="Essentials" 
          products={ESSENTIALS_PRODUCTS} 
          link="/category/essentials" 
        />
      </main>
    </div>
  )
}
