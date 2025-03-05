import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    team: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { team } = teamSlice.actions

export default teamSlice.reducer