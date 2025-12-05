'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogOut, Package, UserCircle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/store/auth-slice'
import { allProducts, InterfaceProduct, SITE_INFO } from '@/constants'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const dispatch = useDispatch()
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  // const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartCount = cartItems.length
  const [search, setsearch] = useState('')
  const [showlist, setShowlist] = useState(false)

  const productDesc = allProducts.filter(p => p.description.toLowerCase().includes(search.toLocaleLowerCase())).sort((a, b) => b.popularity - a.popularity)
  const productTitles = allProducts.filter(p => p.title.toLowerCase().includes(search.toLocaleLowerCase())).sort((a, b) => b.popularity - a.popularity)
  const productList: InterfaceProduct[] = productDesc.length > 0 ? productDesc : productTitles.length > 0 ? productTitles : []
  // useEffect(() => {
  // }, [])


  const router = useRouter()
  const handleLoginRedirect = () => {
    setsearch('')
    setShowlist(false)
    router.push('/auth/login')
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch({ type: 'cart/clearCart' })
    setsearch('')
    setShowlist(false)
    router.push('/')
  }

  const goToCart = () => {
    setsearch('')
    setShowlist(false)
    router.push('/cart')
  }
  const handleSearch = (searchfilter: string) => {
    const query = searchfilter ? '?query=' + searchfilter.replace(/\s+/g, '-').toLowerCase() : ''
    setShowlist(false)
    router.push(`/search${query}`)
  }
  const handleProductList = function (productTitle: string) {
    setsearch(productTitle)
    setShowlist(false)
    handleSearch(productTitle)
  }
  useEffect(() => {
    if (search !== "" && productList.length > 1) {
      setShowlist(true)
    }
  }, [search])
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20 md:grid md:grid-cols-[auto_1fr_auto]">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" onClick={(e) => { setsearch(''); setShowlist(false) }} className="shrink">
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {SITE_INFO.name}
              </h1>
            </Link>

            <div className="hidden ml-1.5 md:flex flex-none items-center gap-7 lg:gap-8">
              <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={(e) => { setsearch(''); setShowlist(false) }}>
                Home
              </Link>
              <Link href="/category/mens" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={(e) => { setsearch(''); setShowlist(false) }}>
                Mens
              </Link>
              <Link href="/category/womens" className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={(e) => { setsearch(''); setShowlist(false) }}>
                Womens
              </Link>
            </div>
          </div>

          {/* Center column: centered search */}
          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-[520px] px-4 lg:px-8">
              <div className="relative w-full">
                <Button
                  onClick={() => handleSearch(search)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent focus:ring-0"
                >
                  <Search className="h-4 w-4 text-muted-foreground pointer-events-none" tabIndex={0} />
                </Button>
                <input
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
                  type="search"
                  placeholder="Search luxury fashion..."
                  value={search}
                  onChange={(e) => { setsearch(e.target.value) }}
                  className="w-full pl-12 pr-4 py-2 bg-secondary/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {showlist && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden">
                    <ul className="flex flex-col">
                      {productList.slice(0, 10).map((product) => (
                        <li
                          key={product.id}
                          onClick={(e) => { e.preventDefault(); handleProductList(product.title) }}
                          className="px-4 py-2 hover:bg-secondary cursor-pointer text-sm text-foreground transition-colors"
                        >
                          {product.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0 min-w-48 justify-end">
            {!isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoginRedirect}
                className="text-sm font-medium min-w-24"
              >
                Login / Signup
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 min-w-20">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium truncate max-w-[100px]">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push('/profile/manage')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Manage Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    See Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={goToCart} className="w-full text-left flex items-center gap-2">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" size="icon" className="relative shrink-0" onClick={goToCart}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setSearchOpen(!searchOpen); setShowlist(true) }}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={goToCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Button
                onClick={() => handleSearch(search)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent focus:ring-0"
              >
                <Search className="h-4 w-4 text-muted-foreground pointer-events-none" />
              </Button>
              <input
                onKeyDown={(e) => e.key === "Enter" && handleSearch(search)}
                type="search"
                placeholder="Search luxury fashion..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {showlist && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden">
                <ul className="flex flex-col">
                  {productList.slice(0, 10).map((product) => (
                    <li
                      key={product.id}
                      onClick={(e) => { handleProductList(product.title) }}
                      className="px-4 py-2 hover:bg-secondary cursor-pointer text-sm text-foreground transition-colors"
                    >
                      {product.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/category/mens"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mens
            </Link>
            <Link
              href="/category/womens"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Womens
            </Link>

            <div className="pt-2 mt-2 border-t border-border">
              {!isLoggedIn ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLoginRedirect}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login / Signup
                </Button>
              ) : (
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm font-medium">{user?.name}</div>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setMobileMenuOpen(false); router.push('/profile/manage') }}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Manage Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setMobileMenuOpen(false); router.push('/orders') }}>
                    <Package className="mr-2 h-4 w-4" />
                    See Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { setMobileMenuOpen(false); router.push('/cart') }}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
