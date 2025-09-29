import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sqlToBeExecuted: '',
  widgitType: '',
  paramValues: {},
  widgitStyle: '',
};

const widgitViewerSlice = createSlice({
  name: 'widgitViewer',
  initialState,
  reducers: {
    setSQL: (state, action) => {
      state.sqlToBeExecuted = action.payload;
    },
    setWidgitType: (state, action) => {
      state.widgitType = action.payload;
    },
    setParamValues: (state, action) => {
      state.paramValues = {
        ...state.paramValues,
        ...action.payload,
      };
    },
    setWidgitStyle: (state, action) => {
      state.widgitStyle = action.payload;
    },
  },
});

export const { setSQL, setWidgitType, setParamValues, setWidgitStyle } =
  widgitViewerSlice.actions;
export default widgitViewerSlice.reducer;
