import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pkColsData: {},
  attachedParentID: null,
  allWidgits: [],
  rootWidgit: {},
  widgitToBeExecuted: {},
  savedDrilldownData: {},
};

const drilldownSlice = createSlice({
  name: 'drilldownConfig',
  initialState: initialState,
  reducers: {
    setPKColsData: (state, action) => {
      state.pkColsData = {
        ...state.pkColsData,
        ...action.payload,
      };
    },
    resetPKColsData: (state) => {
      state.pkColsData = {};
    },
    setAttachedParentID: (state, action) => {
      state.attachedParentID = action.payload;
    },
    setAllwidgits: (state, action) => {
      state.allWidgits = action.payload;
    },
    setRootWidgit: (state, action) => {
      state.rootWidgit = action.payload;
    },
    setWidgitToExecute: (state, action) => {
      state.widgitToBeExecuted = action.payload;
    },
    setSavedDrilldownData: (state, action) => {
      state.savedDrilldownData = action.payload;
    },
  },
});

export const {
  setPKColsData,
  setAttachedParentID,
  setAllwidgits,
  setDrilldownData,
  setRootWidgit,
  setWidgitToExecute,
  resetPKColsData,
  setSavedDrilldownData,
} = drilldownSlice.actions;
export default drilldownSlice.reducer;
