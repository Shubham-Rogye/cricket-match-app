import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const auctionDataSlice = createSlice({
  name: 'auctionData',
  initialState,
  reducers: {
    setAuctionData: (state, actions) => {
      state.value = actions.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAuctionData } = auctionDataSlice.actions

export default auctionDataSlice.reducer