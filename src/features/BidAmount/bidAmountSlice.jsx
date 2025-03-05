import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 200,
}

export const bidAmountSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    incrementBid: (state) => {
      state.value += 50
    },
    setBidValue: (state, action)=>{
        state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { incrementBid, setBidValue } = bidAmountSlice.actions

export default bidAmountSlice.reducer