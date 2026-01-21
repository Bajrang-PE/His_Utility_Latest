import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sqlToBeExecuted: '',
  widgitType: '',
  paramValues: {},
  widgitStyle: '',
  graphDetails: {},
  graphComposition: {},
  widgitData: {},
  kpiData: [],
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
    setGraphDetails: (state, action) => {
      state.graphDetails = action.payload;
    },

    setGraphComposition: (state, action) => {
      state.graphComposition = action.payload;
    },
    setWidgitData: (state, action) => {
      state.widgitData = action.payload;
    },
    setKPIData: (state, action) => {
      state.kpiData = action.payload;
    },
  },
});

export const {
  setSQL,
  setWidgitType,
  setParamValues,
  setWidgitStyle,
  setGraphDetails,
  setGraphComposition,
  setWidgitData,
  setKPIData,
} = widgitViewerSlice.actions;
export default widgitViewerSlice.reducer;
