import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loginPageCheckSlice = createSlice({
  name: 'loginPage',
  initialState,
  reducers: {
    loginPageTrue: (state) => {
      state.value = true
    },
    loginPageFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginPageTrue, loginPageFalse } = loginPageCheckSlice.actions

export default loginPageCheckSlice.reducer