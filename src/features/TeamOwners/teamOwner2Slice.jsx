import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const teamOwner2Slice = createSlice({
  name: 'teamOwner2',
  initialState,
  reducers: {
    teamOwner2: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { teamOwner2 } = teamOwner2Slice.actions

export default teamOwner2Slice.reducer