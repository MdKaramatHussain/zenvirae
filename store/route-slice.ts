import { SITE_INFO } from '@/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RoutePath {
  id: string
  category: string
}

const loadPathFromStorage = (): RoutePath => {
  if (typeof window === 'undefined') return {id: SITE_INFO.homePath, category: ""}
  try {
    const routeDetails = localStorage.getItem('current-route')
    return routeDetails ? JSON.parse(routeDetails) : {id: SITE_INFO.homePath, category: ""}
  } catch {
    return {id: SITE_INFO.homePath, category: ""}
  }
}

const savePathToStorage = (items: RoutePath) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('current-route', JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

const initialState = (): RoutePath => {
    const details = loadPathFromStorage()
    return {
        id: details.id,
        category: details.category
    }
}

const routeSlice = createSlice({
  name: 'route-slice',
  initialState,
  reducers: {
    addroute: (state, action: PayloadAction<Omit<RoutePath, 'quantity'>>) => {
      state.id = action.payload.id
      state.category = action.payload.category
      savePathToStorage(state)
    },
  },
})

export const { addroute} = routeSlice.actions
export default routeSlice.reducer
