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
    updateTeamPoints:(state, action) =>{
      const { pointCheck, newPoints } = action.payload;
      state.value[pointCheck].points = newPoints;
    }

  },
})

// Action creators are generated for each case reducer function
export const { team, updateTeamPoints } = teamSlice.actions

export default teamSlice.reducer