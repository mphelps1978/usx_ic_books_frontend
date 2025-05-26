import { configureStore } from "@reduxjs/toolkit"
import authReducer from './slices/authSlice'
import loadsReducer from './slices/loadsSlice'
import formReducer from './slices/formSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loads: loadsReducer,
    form: formReducer,
  },
})


