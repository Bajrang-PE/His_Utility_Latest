// features/tab/tabSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draggable: null,
};

const dndSlice = createSlice({
  name: 'dnd',
  initialState,
  reducers: {
    setDraggable: (state, action) => {
      state.draggable = action.payload;
    },
  },
});

export const { setDraggable } = dndSlice.actions;
export default dndSlice.reducer;
