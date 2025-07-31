import React from 'react';
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

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/HIS_dashboard/*" element={<HisRoutes />} />
          {/* <Route path="/dvdms/*" element={<LoginWarRoutes />} /> */}
          <Route index element={<DbConfigMaster />} />
          {/* <Route path="db" element={<DbConfigMaster />} /> */}
          {/* <Route path="/dvdms" element={<HomePage />} /> */}
          {/* <Route path index element={<NotFound />} /> */}

        </Routes>
        <ToastContainer />
        <ConfirmBox message={"Do you want to save this data?"} />
        <Loader />
      </Router>
    </>
  )
}

export default App
