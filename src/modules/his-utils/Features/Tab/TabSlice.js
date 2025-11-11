// features/tab/tabSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeIndex: 0,
  tabData: {},
};

const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeIndex = action.payload;
    },
    setTabData: (state, action) => {
      state.tabData = action.payload;
    },
  },
});

export const { setActiveTab, setTabData } = tabSlice.actions;
export default tabSlice.reducer;
