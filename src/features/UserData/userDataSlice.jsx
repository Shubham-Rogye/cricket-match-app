import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, actions) => {
      state.value = actions.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserData } = userDataSlice.actions

export default userDataSlice.reducer