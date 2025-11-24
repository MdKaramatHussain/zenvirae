"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ORDERS } from '@/constants'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const STEPS = [
  'Pending',
  'Order Received',
  'Processing',
  'Packed',
  'Shipped',
  'In Transit',
  'Out for Delivery',
  'Delivered',
]

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case 'Delivered':
      return 'bg-green-500/20 text-green-600'
    case 'In Transit':
      return 'bg-blue-500/20 text-blue-600'
    case 'Shipped':
      return 'bg-purple-500/20 text-purple-600'
    case 'Pending':
      return 'bg-yellow-500/20 text-yellow-600'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function TrackOrderPage() {
  const router = useRouter()
  const params = useParams() as { orderId?: string }
  const { isLoggedIn } = useSelector((s: RootState) => s.auth)
  const { toast } = useToast()
  const [visible, setVisible] = useState(false)

  const orderId = params?.orderId ?? ''

  const order = useMemo(() => ORDERS.find((o) => o.id === orderId), [orderId])

  useEffect(() => {
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      toast.warning({ title: 'Please log in to track your order.' })
      router.push('/login')
    }
  }, [isLoggedIn, router, toast])

  useEffect(() => {
    if (isLoggedIn && !order) {
      // order not found
      toast.error({ title: 'Order not found.' })
      router.push('/orders')
    }
  }, [isLoggedIn, order, router, toast])

  if (!isLoggedIn || !order) return null

  const currentIndex = Math.max(0, STEPS.indexOf(order.status as string))

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold">Track Order</h1>
        <p className="text-muted-foreground mt-2">Order ID: <span className="font-medium">{order.id}</span></p>
      </header>

      <div className={`bg-background/60 border border-border rounded-xl shadow-sm overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-6 lg:p-8">
          {/* Top Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <Link href={`/product/${order.productId}`} className="block shrink-0">
              <img
                src={order.image}
                alt={order.title}
                onError={(e) => {
                  // @ts-ignore
                  e.currentTarget.src = '/luxury-designer-handbag.jpg'
                }}
                className="w-36 h-36 object-cover rounded-xl shadow-sm"
              />
            </Link>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground">{order.title}</h2>
              <div className="mt-2 text-muted-foreground text-sm">
                <div>Price: <span className="font-medium">₹{order.price}</span></div>
                <div>Quantity: {order.quantity}</div>
                <div>Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
              </div>

              <div className="mt-4">
                <div className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(order.status)} `}>
                  {order.status}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4">Tracking Timeline</h3>

            <div className="relative pl-6">
              {/* vertical line */}
              <div className="absolute left-3 top-3 bottom-3 border-l-2 border-border" />

              <ul className="space-y-6">
                {STEPS.map((step, idx) => {
                  const completed = idx < currentIndex
                  const current = idx === currentIndex

                  return (
                    <li key={step} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-6">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${completed ? 'bg-green-600 text-white' : current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {completed ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full block" />}
                          </div>
                        </div>

                        <div className="pl-1">
                          <div className={`${completed ? 'text-green-600' : current ? 'text-blue-600' : 'text-gray-400'} font-medium`}>{step}</div>
                          <div className="text-muted-foreground text-sm mt-1">{completed ? 'Completed' : current ? 'In progress' : 'Upcoming'}</div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={() => router.push(`/product/${order.productId}`)} className="w-full sm:w-auto">View Product</Button>
              <Button variant="ghost" onClick={() => router.push('/orders')} className="w-full sm:w-auto">Back to Orders</Button>
            </div>
            <div className="mt-2 sm:mt-0 text-sm text-muted-foreground">Expected Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '—'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
