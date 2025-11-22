import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface User {
  id: number | string
  name: string
  email: string
  phone: string
  password: string
  avatar?: string
}


interface AuthState {
  user: User | null
  isLoggedIn: boolean
}

const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const user = localStorage.getItem('zenvirae-user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const saveUserToStorage = (user: User | null) => {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem('zenvirae-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('zenvirae-user')
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
  },
})

export const { login, logout, register, loadUserFromStorageAction } = authSlice.actions
export default authSlice.reducer
