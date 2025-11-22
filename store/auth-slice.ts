import { USER_KEY } from '@/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface Address {
  id: string
  fullName: string
  phone: string
  pincode: string
  state: string
  city: string
  house: string
  area: string
}

export interface User {
  id: number | string
  name: string
  email: string
  phone: string
  password?: string
  avatar?: string
  addresses?: Address[]
}


interface AuthState {
  user: User | null
  isLoggedIn: boolean
}

const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const saveUserToStorage = (user: User | null) => {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isLoggedIn: !!loadUserFromStorage(),
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoggedIn = true
      saveUserToStorage(action.payload)
    },
    logout: (state) => {
      state.user = null
      state.isLoggedIn = false
      saveUserToStorage(null)
    },
    register: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isLoggedIn = true
      saveUserToStorage(action.payload)
    },
    loadUserFromStorageAction: (state) => {
      const user = loadUserFromStorage()
      state.user = user
      state.isLoggedIn = !!user
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
      saveUserToStorage(state.user)
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (!state.user) return
      const addresses = state.user.addresses ?? []
      addresses.unshift(action.payload)
      state.user.addresses = addresses
      saveUserToStorage(state.user)
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      if (!state.user) return
      const addresses = state.user.addresses ?? []
      state.user.addresses = addresses.filter((a) => a.id !== action.payload)
      saveUserToStorage(state.user)
    },
  },
})

export const { login, logout, register, loadUserFromStorageAction, updateProfile, addAddress, deleteAddress } = authSlice.actions
export default authSlice.reducer
