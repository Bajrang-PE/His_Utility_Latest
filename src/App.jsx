import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HisRoutes from './modules/his-utils/HisRoutes';
import { ToastContainer } from 'react-toastify';
import ConfirmBox from './modules/his-utils/components/commons/ConfirmBox';
import Loader from './modules/his-utils/components/commons/Loader';
import "react-datepicker/dist/react-datepicker.css";
import DbConfigMaster from './modules/his-utils/pages/dashboardMasterPgs/DbConfigMaster';
import BarRaceChart from './modules/his-utils/pages/TestBar';
import useAutoLogout from './hooks/useAutoLogout';
import Auth from './Auth';

function App() {

  // useAutoLogout(20);

  return (
    <>
      <Routes>
        {/* <Route path="/HIS_dashboard/*" element={<Auth comp={HisRoutes} />} /> */}
        <Route path="/HIS_dashboard/*" element={<HisRoutes />} />
        {/* <Route index element={<Auth comp={DbConfigMaster} />} /> */}
        <Route index element={<DbConfigMaster />} />
      </Routes>
      <ToastContainer />
      <ConfirmBox message={"Do you want to save this data?"} />
      <Loader />
    </>
  )
}

export default App
