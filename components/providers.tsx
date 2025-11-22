'use client'

import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Navbar />
      <main className="min-h-[calc(100vh-6rem)]">{children}</main>
      <Footer />
      <Toaster />
    </Provider>
  )
}
