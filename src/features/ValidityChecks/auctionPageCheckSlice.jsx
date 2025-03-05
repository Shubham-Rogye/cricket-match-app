import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const auctionPageCheckSlice = createSlice({
  name: 'auctionPage',
  initialState,
  reducers: {
    auctionPageTrue: (state) => {
      state.value = true
    },
    auctionPageFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { auctionPageTrue, auctionPageFalse } = auctionPageCheckSlice.actions

export default auctionPageCheckSlice.reducer