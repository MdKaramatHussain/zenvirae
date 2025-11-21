import { STORAGE_KEY } from '@/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  category?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  promoCode?: string | null
  promoDiscount?: number
}

const loadStateFromStorage = (): CartState => {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    // Restore full state if present (support legacy shape where only items were stored)
    return {
      items: parsed.items ?? [],
      promoCode: parsed.promoCode ?? null,
      promoDiscount: parsed.promoDiscount ?? 0,
    }
  } catch (err) {
    return { items: [] }
  }
}

const saveStateToStorage = (state: CartState) => {
  if (typeof window === 'undefined') return
  try {
    // Persist full cart state (items + promo fields) as requested
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, promoCode: state.promoCode ?? null, promoDiscount: state.promoDiscount ?? 0 }))
  } catch (error) {
    console.error('Failed to save cart state:', error)
  }
}

const initialState: CartState | null = loadStateFromStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      saveStateToStorage(state)
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
      saveStateToStorage(state)
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1)
      }
      saveStateToStorage(state)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
      saveStateToStorage(state)
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) item.quantity = Math.max(1, action.payload.quantity)
      saveStateToStorage(state)
    },
    applyPromoCode: (state, action: PayloadAction<string | null>) => {
      state.promoCode = action.payload
      state.promoDiscount = 0
      saveStateToStorage(state)
    },
    setPromoDiscount: (state, action: PayloadAction<number>) => {
      state.promoDiscount = action.payload
      saveStateToStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      state.promoCode = null
      state.promoDiscount = 0
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, increaseQuantity, decreaseQuantity, applyPromoCode, setPromoDiscount } = cartSlice.actions
export default cartSlice.reducer
