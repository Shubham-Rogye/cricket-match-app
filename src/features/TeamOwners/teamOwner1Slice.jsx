import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const teamOwner1Slice = createSlice({
  name: 'teamOwner1',
  initialState,
  reducers: {
    teamOwner1: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { teamOwner1 } = teamOwner1Slice.actions

export default teamOwner1Slice.reducer