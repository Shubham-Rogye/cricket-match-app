import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const newPlayerButtonSlice = createSlice({
  name: 'newPlayer',
  initialState,
  reducers: {
    newPlayerTrue: (state) => {
      state.value = true
    },
    newPlayerFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { newPlayerTrue, newPlayerFalse } = newPlayerButtonSlice.actions

export default newPlayerButtonSlice.reducer