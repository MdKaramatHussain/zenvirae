import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart-slice'
import authReducer from './auth-slice'
import routeReducer from './route-slice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    reduxRoute: routeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
