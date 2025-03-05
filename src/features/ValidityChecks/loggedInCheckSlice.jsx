import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loggedInCheckSlice = createSlice({
  name: 'loggedIn',
  initialState,
  reducers: {
    loggedInTrue: (state) => {
      state.value = true
    },
    loggedInFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { loggedInTrue, loggedInFalse } = loggedInCheckSlice.actions

export default loggedInCheckSlice.reducer