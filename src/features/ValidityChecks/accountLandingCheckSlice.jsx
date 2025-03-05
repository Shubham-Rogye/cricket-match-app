import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const accountLandingCheckSlice = createSlice({
  name: 'accountLanding',
  initialState,
  reducers: {
    accountLandingTrue: (state) => {
      state.value = true
    },
    accountLandingFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { accountLandingTrue, accountLandingFalse } = accountLandingCheckSlice.actions

export default accountLandingCheckSlice.reducer