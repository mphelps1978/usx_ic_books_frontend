import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const apiurl = 'http://localhost:3001/api'

export const fetchLoads = createAsyncThunk('/loads/fetchLoads', async(_, { getState }) => {
  const { token } = getState().auth
  const response = await axios.get(`${apiurl}/loads`, {
    headers: { Authorization: `Bearer: ${token}`},
  })
  return response.data
})

export const addLoad = createAsyncThunk('/loads/addLoad', async (load, { getState }) => {
  const { token } = getState().auth
  const response = await axios.post(`${apiurl}/loads`, load, {
    headers: { Authorization: `Bearer: ${ token}`},
  })
  return response.data
})

export const updateLoad = createAsyncThunk('/loads/updateLoad', async ({ proNumber, load }, { getState }) => { 
  const token = getState().auth
  const response = await axios.put(`${apiurl}/loads/${proNumber}`, load, {
    headers: { Authorization: `Bearer: ${token}` },
  })
  return response.data
})

export const deleteLoad = createAsyncThunk('loads/deleteLoad', async (proNumber, { getState }) => {
  const response = await axios.delete(`${apiurl}/loads/${proNumber}`, {
    headers: { Authorization: `Bearer: ${token}` },
  })
  return proNumber
})

const loadSlice = createSlice({
  name: 'loads',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoads.fulfilled, (state, action) => action.payload)
      .addCase(addLoad.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(updateLoad.fulfilled, (state, action) => {
        const index = state.findIndex((load) => load.proNumber === action.payload.proNumber)
        if (index !== -1) state[index] = action.payload
      })
      .addCase(deleteLoad.fulfilled, (state, action) => {
      return state.filter((load) => load.proNumber !== action.payload)
    })
  }
})

export default loadSlice.reducer

