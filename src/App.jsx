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
import { ToastAlert } from './modules/his-utils/utils/commonFunction';
import BarRaceChart from './modules/his-utils/pages/TestBar';

function App() {

  const logout = () => {
    localStorage.clear();
    if (window.location.search !== '') {
      window.location.search = '?session-out'
    }
    sessionStorage.clear();
    // Cookies.remove('csrfToken');
    ToastAlert('Your Session Expired!', 'error')
  };

  const timerRef = useRef(null);
  const timeout = 60000 * 10;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'load', 'click', 'resize'];
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/HIS_dashboard/*" element={<HisRoutes />} />
          {/* <Route path="/dvdms/*" element={<LoginWarRoutes />} /> */}
          <Route index element={<DbConfigMaster />} />
          {/* <Route path="db" element={<DbConfigMaster />} /> */}
          <Route path="/test" element={<BarRaceChart />} />
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
