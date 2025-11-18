import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const cart = localStorage.getItem('zenvirae-cart')
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('zenvirae-cart', JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

const initialState: CartState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      saveCartToStorage(state.items)
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
