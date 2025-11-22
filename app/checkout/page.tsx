'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { applyPromoCode, setPromoDiscount, clearCart } from '@/store/cart-slice'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast: toastClient } = useToast()

  const { user, isLoggedIn } = useSelector((s: RootState) => s.auth)
  const cart = useSelector((s: RootState) => s.cart)

  const items = cart?.items ?? []

  // Payment state
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'NetBanking' | 'COD'>('COD')

  // Promo input
  const [promoInput, setPromoInput] = useState('')
  const [applying, setApplying] = useState(false)

  // Pre-checks: login and address
  useEffect(() => {
    if (!isLoggedIn) {
      toastClient.warning({ title: 'Please log in to continue.' })
      // use the project's login route
      setTimeout(() => router.push('/auth/login'), 700)
      return
    }

    const addresses = user?.addresses ?? []
    if (isLoggedIn && addresses.length === 0) {
      toastClient.warning({ title: 'Please add an address before checkout.' })
      setTimeout(() => router.push('/profile/manage'), 700)
      return
    }
  }, [isLoggedIn, user, router, toastClient])

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items])

  const deliveryCharges = subtotal >= 1000 || subtotal === 0 ? 0 : 50

  const promoDiscount = cart?.promoDiscount ?? 0

  const total = Math.max(0, subtotal + deliveryCharges - (promoDiscount || 0))

  const selectedAddress = user?.addresses && user.addresses.length > 0 ? user.addresses[0] : null

  const handleApplyPromo = () => {
    if (!promoInput || promoInput.trim().length === 0) {
      toastClient.error({ title: 'Please enter a promo code.' })
      return
    }

    setApplying(true)
    const code = promoInput.trim().toUpperCase()

    // Demo promo rules
    if (code === 'ZEN10') {
      const discount = Math.round(subtotal * 0.1)
      dispatch(applyPromoCode(code))
      dispatch(setPromoDiscount(discount))
      toastClient.success({ title: 'Promo applied', description: `You saved ₹${discount}` })
    } else if (code === 'FREESHIP') {
      dispatch(applyPromoCode(code))
      dispatch(setPromoDiscount(deliveryCharges))
      toastClient.success({ title: 'Free shipping applied' })
    } else {
      dispatch(applyPromoCode(null))
      dispatch(setPromoDiscount(0))
      toastClient.error({ title: 'Invalid promo code' })
    }

    setTimeout(() => setApplying(false), 500)
  }

  const handleProceed = () => {
    // Basic validate
    if (!isLoggedIn) {
      toastClient.warning({ title: 'Please log in to continue.' })
      router.push('/auth/login')
      return
    }
    if (!selectedAddress) {
      toastClient.warning({ title: 'Please add an address before checkout.' })
      router.push('/profile/manage')
      return
    }

    // Place order (demo)
    toastClient.success({ title: 'Order placed successfully!' })
    // Optionally clear cart
    dispatch(clearCart())
    setTimeout(() => router.push('/order-success'), 800)
  }

  const handleCancel = () => {
    toastClient.error({ title: 'Order cancelled' })
    setTimeout(() => router.push('/'), 600)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: main form */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-background/60 border border-border rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delivery Address</h3>
              <Link href="/profile/manage" className="text-sm text-primary hover:underline">Edit Address</Link>
            </div>
            {selectedAddress ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="text-foreground font-medium">{selectedAddress.fullName}</div>
                <div>{selectedAddress.phone}</div>
                <div>{selectedAddress.house}, {selectedAddress.area}</div>
                <div>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No address selected.</div>
            )}
          </section>

          <section className="bg-background/60 border border-border rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-3">Payment Options</h3>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${paymentMode === 'COD' ? 'bg-primary/5 border border-primary' : 'hover:bg-secondary/30'}`}>
                <input type="radio" name="payment" checked={paymentMode === 'COD'} onChange={() => setPaymentMode('COD')} className="accent-primary" />
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-muted-foreground">Pay when you receive the order</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${paymentMode === 'UPI' ? 'bg-primary/5 border border-primary' : 'hover:bg-secondary/30'}`}>
                <input type="radio" name="payment" checked={paymentMode === 'UPI'} onChange={() => setPaymentMode('UPI')} className="accent-primary" />
                <div>
                  <div className="font-medium">UPI</div>
                  <div className="text-sm text-muted-foreground">Pay securely with your UPI app</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${paymentMode === 'NetBanking' ? 'bg-primary/5 border border-primary' : 'hover:bg-secondary/30'}`}>
                <input type="radio" name="payment" checked={paymentMode === 'NetBanking'} onChange={() => setPaymentMode('NetBanking')} className="accent-primary" />
                <div>
                  <div className="font-medium">Net Banking</div>
                  <div className="text-sm text-muted-foreground">Use your bank account online</div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <aside className="md:col-span-1 sticky top-28">
          <div className="bg-background/60 border border-border rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between py-1"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between py-1"><span>Delivery</span><span>{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span></div>
              <div className="flex justify-between py-1"><span>Promo</span><span className="text-foreground">{cart?.promoCode ?? '—'}</span></div>
              {promoDiscount > 0 && (
                <div className="flex justify-between py-1 text-green-600"><span>Discount</span><span>-₹{promoDiscount}</span></div>
              )}
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center mb-3">
                <Input placeholder="Promo code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
                <Button className="ml-3" onClick={handleApplyPromo} disabled={applying}>{applying ? 'Applying...' : 'Apply'}</Button>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={handleProceed}>Proceed</Button>
              <Button variant="ghost" className="flex-1" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
