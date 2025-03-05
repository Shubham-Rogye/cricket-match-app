import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const soldPlayerDBSlice = createSlice({
  name: 'soldPlayerDB',
  initialState,
  reducers: {
    soldPlayerDB: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { soldPlayerDB } = soldPlayerDBSlice.actions

export default soldPlayerDBSlice.reducer