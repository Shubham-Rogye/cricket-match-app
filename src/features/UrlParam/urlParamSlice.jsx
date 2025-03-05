import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: "",
}

export const urlParamSlice = createSlice({
  name: 'urlParam',
  initialState,
  reducers: {
    urlParamSet: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { urlParamSet } = urlParamSlice.actions

export default urlParamSlice.reducer