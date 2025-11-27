"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ORDERS } from '@/constants'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { addroute } from '@/store/route-slice'

function getStatusClasses(status: string) {
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

export default function OrdersPage() {
  const router = useRouter()
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const { toast } = useToast()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      // show warning toast then redirect to login page
      toast.warning({ title: 'Please log in to view your orders.' })
      // project uses /auth/login — redirecting there to match routes
      router.push('/auth/login')
    }
  }, [isLoggedIn, router, toast])

  if (!isLoggedIn) {
    return null
  }

    const handleNavigate = (order:any) => {
      dispatch(
        addroute({
          id: order.productId,
          category: order.category,
        })
      )
      order.title = order.title.replace(/\s+/g, '-').toLowerCase();
      router.push(`/product/${order.title}`)
    }
  
  if (ORDERS.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold">My Orders</h2>
        <p className="text-muted-foreground mt-2">A history of your recent purchases.</p>
      </header>
      <div className="rounded-lg border border-border/40 p-12 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">You have no rders to Show</h2>
        <p className="text-muted-foreground mb-6">Explore our latest collections and buy luxury pieces for you.</p>
        <Button onClick={() => router.push('/')} className="bg-primary text-primary-foreground">Return to Home</Button>
      </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold">My Orders</h2>
        <p className="text-muted-foreground mt-2">A history of your recent purchases.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ORDERS.map((order) => (
          <article
            key={order.id}
            className="bg-background/60 border border-border rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <Link href={`/product/${order.productId}`} className="block">
                <img
                  src={order.image}
                  alt={order.title}
                  onError={(e) => {
                    // fallback image if broken
                    // use a safe existing asset
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    e.currentTarget.src = '/luxury-designer-handbag.jpg'
                  }}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
              </Link>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{order.title}</h3>
                  <div className="mt-2 text-muted-foreground text-sm">
                    <div>Price: <span className="font-medium">₹{order.price}</span></div>
                    <div>Quantity: {order.quantity}</div>
                    <div>Order Date: {new Date(order.orderDate).toLocaleDateString()}</div>
                    {order.status === 'Delivered' && order.deliveryDate && (
                      <div>Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center">
                    <div
                      className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium shrink-0 ${getStatusClasses(
                        order.status,
                      )} transition-all`}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-2">
                    <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={()=> handleNavigate(order)}>
                      View Product
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="w-full md:w-auto"
                    >
                      Track Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
