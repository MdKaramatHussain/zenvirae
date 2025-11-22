"use client"
import React, { useMemo, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart, applyPromoCode, setPromoDiscount } from '@/store/cart-slice'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { toastDuration } from '@/constants'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { items, promoCode, promoDiscount } = useSelector((state: RootState) => state.cart)
  const [code, setCode] = useState('')
  const [promoMsg, setPromoMsg] = useState<string | null>(null)

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  // delivery logic
  const delivery = subtotal > 0 && subtotal < 999 ? 49 : 0

  const calculatePromo = (codeInput: string) => {
    const c = String(codeInput ?? '').toUpperCase().trim()
    if (c === 'WELCOME10') {
      return Math.round(subtotal * 0.1)
    }
    if (c === 'SAVE200') {
      if (subtotal > 1499) return 200
      return -1
    }
    return -2
  }

  const handleApplyPromo = () => {
    const result = calculatePromo(code)
    if (result === -2) {
      setPromoMsg('Invalid promo code')
      dispatch(applyPromoCode(null))
      dispatch(setPromoDiscount(0))
      return
    }
    if (result === -1) {
      setPromoMsg('SAVE200 requires subtotal > ₹1,499')
      dispatch(applyPromoCode(null))
      dispatch(setPromoDiscount(0))
      return
    }
    const applied = code.toUpperCase().trim()
    dispatch(applyPromoCode(applied))
    dispatch(setPromoDiscount(result))
    setPromoMsg(`Promo applied: saved ₹ ${result}`)
    // show applied code in the input field
    setCode(applied)
  }

  // If a promo code exists in Redux (session), reflect it in the input field
  React.useEffect(() => {
    if (promoCode) setCode(promoCode)
  }, [promoCode])

  const handleProceed = () => {
    if (items.length === 0) return
    router.push('/checkout')
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    try {
      toast.error({ title: 'Cart cleared successfully!', duration: toastDuration })
    } catch {}
  }

  const total = subtotal + delivery - (promoDiscount ?? 0)

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-full">
      <main className="flex-1 py-12 w-full max-w-full">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold mb-8">Your Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            <div className="lg:col-span-8 w-full">
              {items.length === 0 ? (
                <div className="rounded-lg border border-border/40 p-12 text-center">
                  <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
                  <p className="text-muted-foreground mb-6">Explore our latest collections and add luxury pieces to your cart.</p>
                  <Button onClick={() => router.push('/')} className="bg-primary text-primary-foreground">Return to Home</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex w-full items-start gap-4 p-3 sm:p-4 rounded-lg border border-border/40 shadow-sm">
                      <div className="flex items-start gap-2 shrink-0">
                        <div className="w-20 h-24 relative rounded overflow-hidden bg-muted shrink-0">
                          <Image src={item.image || '/placeholder.svg'} alt={item.title} fill className="object-cover" />
                        </div>
                        <button onClick={() => { dispatch(removeFromCart(item.id)); try { toast.error({ title: 'Item removed from cart', description: item.title, duration: toastDuration }) } catch{} }} aria-label="Remove item" className="p-2 rounded-md hover:bg-secondary/50 transition self-start sm:self-auto">
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-medium text-lg truncate">{item.title}</h3>
                        <div className="text-sm text-muted-foreground">{item.category ?? 'Uncategorized'}</div>
                        <div className="mt-2 flex items-center justify-between gap-1 flex-wrap">
                          <div className="flex items-center gap-2 border border-border rounded-md overflow-hidden">
                            <button onClick={() => dispatch(decreaseQuantity(item.id))} className="px-1.5 py-1 sm:px-3 sm:py-2 hover:bg-secondary/50">-</button>
                            <div className="px-2 py-1 sm:px-4 sm:py-2 bg-background">{item.quantity}</div>
                            <button onClick={() => dispatch(increaseQuantity(item.id))} className="px-1.5 sm:px-3 sm:py-2 hover:bg-secondary/50">+</button>
                          </div>
                          <div className="font-semibold whitespace-nowrap">₹ {Number(item.price).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 min-w-0 w-full max-w-full">
              <div className="lg:sticky lg:top-24 w-full">
                <div className="rounded-lg border border-border/40 p-4 sm:p-6 bg-background shadow-md min-w-0 w-full max-w-full overflow-hidden">
                  <h2 className="font-medium text-lg mb-4">Order Summary</h2>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? 'FREE' : `₹ ${delivery}`}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Promo discount</span>
                    <span>- ₹ {promoDiscount ?? 0}</span>
                  </div>
                  <div className="border-t border-border/40 mt-4 pt-4 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-serif text-2xl font-bold">₹ {total.toLocaleString()}</div>
                  </div>

                  <div className="mt-6">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" className="w-full px-3 py-2 border border-border rounded-md mb-2" />
                    <div className="flex gap-2">
                      <Button onClick={handleApplyPromo} className="flex-1 bg-primary text-primary-foreground">Apply</Button>
                      <Button onClick={() => { setCode(''); setPromoMsg(null); dispatch(applyPromoCode(null)); dispatch(setPromoDiscount(0)) }} variant="ghost" className="flex-1">Clear</Button>
                    </div>
                    {promoMsg && <div className="mt-2 text-sm text-muted-foreground">{promoMsg}</div>}
                  </div>

                  <div className="mt-6 text-sm text-muted-foreground">
                    <div>Estimated delivery: <span className="text-foreground font-medium">2-5 business days</span></div>
                    <div className="mt-2">Delivery by: <span className="text-foreground font-medium">PremiumExpress (placeholder)</span></div>
                  </div>

                    <div className="mt-6">
                    <Button onClick={handleProceed} className="w-full py-3 bg-primary text-primary-foreground" disabled={items.length === 0}>Proceed to Checkout</Button>
                    <Button onClick={handleClearCart} variant="ghost" className="w-full mt-2">Clear Cart</Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
