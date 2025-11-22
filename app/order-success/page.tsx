'use client'

import React from 'react'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-serif font-bold mb-4">Thank you — Order placed</h1>
      <p className="text-muted-foreground mb-8">Your order has been placed successfully. We will send updates to your email / phone.</p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">Continue Shopping</Link>
        <Link href="/profile/manage" className="inline-block px-6 py-3 rounded-xl border border-border">Manage Orders</Link>
      </div>
    </div>
  )
}
