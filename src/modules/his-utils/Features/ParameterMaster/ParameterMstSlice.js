import { createSlice } from '@reduxjs/toolkit';

const initialState = { parametersResultSet: [] };

const parameterMstSlice = createSlice({
  name: 'paramMst',
  initialState: initialState,
  reducers: {
    setResultSet: (state, action) => {
      //RTK uses immer under the hood which helps in immutablity and avoids state mutation
      state.parametersResultSet = action.payload;
    },
  },
});

export const { setResultSet } = parameterMstSlice.actions;
export default parameterMstSlice.reducer;
