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
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <FeaturedProducts />
        
        <ProductRow 
          title="Men's Clothing" 
          products={MENS_PRODUCTS} 
          link="/mens" 
        />
        
        <ProductRow 
          title="Women's Clothing" 
          products={WOMENS_PRODUCTS} 
          link="/womens" 
        />
        
        <ProductRow 
          title="Shoes" 
          products={SHOES_PRODUCTS} 
          link="/shoes" 
        />
        
        <ProductRow 
          title="Jewellery" 
          products={JEWELLERY_PRODUCTS} 
          link="/jewellery" 
        />
        
        <ProductRow 
          title="Essentials" 
          products={ESSENTIALS_PRODUCTS} 
          link="/essentials" 
        />
      </main>
      <Footer />
    </div>
  )
}
