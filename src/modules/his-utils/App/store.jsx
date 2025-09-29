import { configureStore } from '@reduxjs/toolkit';
import tabReducer from '../Features/Tab/TabSlice';
import paramMstReducer from '../Features/ParameterMaster/ParameterMstSlice';
import widgitViewerReducer from '../Features/WidgitEngine/WidgitViewerSlice';
import dndReducer from '../Features/Drag&Drop/DnDSlice';
import popupDataReducer from '../Features/Popup/popupSlice';

const store = configureStore({
  reducer: {
    tab: tabReducer,
    paramMst: paramMstReducer,
    widgitViewer: widgitViewerReducer,
    dnd: dndReducer,
    popupData: popupDataReducer,
  },
});

export default store;
