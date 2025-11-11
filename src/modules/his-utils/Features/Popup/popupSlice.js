import { createSlice } from '@reduxjs/toolkit';

const popupDataSlice = createSlice({
  name: 'popupData',
  initialState: {
    parametersData: [],
    popupState: false,
    theme: [],
  },
  reducers: {
    setPopupData: (state, action) => {
      state.parametersData = [...state.parametersData, ...action.payload];
    },

    removePopupData: (state, action) => {
      state.parametersData = state.parametersData.filter(
        (widget) => widget.id !== action.payload
      );
    },
    resetDefaultState: (state) => {
      state.parametersData = [];
    },
    togglePopup: (state, action) => {
      state.popupState = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setPopupData,
  removePopupData,
  togglePopup,
  setTheme,
  resetDefaultState,
} = popupDataSlice.actions;

export default popupDataSlice.reducer;
