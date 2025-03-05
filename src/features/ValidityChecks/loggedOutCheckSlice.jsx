import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loggedOutCheckSlice = createSlice({
  name: 'loggedOut',
  initialState,
  reducers: {
    loggedOutTrue: (state) => {
      state.value = true
    },
    loggedOutFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { loggedOutTrue, loggedOutFalse } = loggedOutCheckSlice.actions

export default loggedOutCheckSlice.reducer