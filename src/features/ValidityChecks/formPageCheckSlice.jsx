import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const formPageCheckSlice = createSlice({
  name: 'formPage',
  initialState,
  reducers: {
    formPageTrue: (state) => {
      state.value = true
    },
    formPageFalse: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { formPageTrue, formPageFalse } = formPageCheckSlice.actions

export default formPageCheckSlice.reducer