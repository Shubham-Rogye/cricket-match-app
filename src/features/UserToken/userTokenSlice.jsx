import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: "",
}

export const userTokenSlice = createSlice({
  name: 'userToken',
  initialState,
  reducers: {
    setUserToken: (state, actions) => {
      state.value = actions.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserToken } = userTokenSlice.actions

export default userTokenSlice.reducer