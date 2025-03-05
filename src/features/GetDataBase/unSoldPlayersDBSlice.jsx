import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const unSoldPlayerDBSlice = createSlice({
  name: 'unSoldPlayerDB',
  initialState,
  reducers: {
    unSoldPlayerDB: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { unSoldPlayerDB } = unSoldPlayerDBSlice.actions

export default unSoldPlayerDBSlice.reducer