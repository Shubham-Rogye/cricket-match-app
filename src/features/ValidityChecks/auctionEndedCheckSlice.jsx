import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const auctionEndedCheckSlice = createSlice({
  name: 'auctionEnded',
  initialState,
  reducers: {
    auctionEndedTrue: (state) => {
      state.value = true
    },
    auctionEndedFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { auctionEndedTrue, auctionEndedFalse } = auctionEndedCheckSlice.actions

export default auctionEndedCheckSlice.reducer