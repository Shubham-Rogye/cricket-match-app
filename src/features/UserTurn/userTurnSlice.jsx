import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 1,
}

export const userTurnSlice = createSlice({
  name: 'turn',
  initialState,
  reducers: {
    player1turn: (state) => {
      state.value = 1
    },
    player2turn: (state) => {
      state.value = 2
    },
  },
})

// Action creators are generated for each case reducer function
export const { player1turn, player2turn } = userTurnSlice.actions

export default userTurnSlice.reducer