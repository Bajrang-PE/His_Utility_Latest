import { Route, Routes } from "react-router-dom";
import './HisUtils.css'
import { lazy } from "react";
import DashboardMst from "./pages/dashboard/DashboardMst";
import Tabular from "./components/sidebar/Tabular";

const DbConfigMaster = lazy(() => import('./pages/dashboardMasterPgs/DbConfigMaster'));
const ParameterMaster = lazy(() => import('./pages/dashboardMasterPgs/ParameterMaster'));
const DbSubmenuMaster = lazy(() => import('./pages/webServiceMasterPgs/DbSubmenuMaster'));
const ServiceUserMaster = lazy(() => import('./pages/webServiceMasterPgs/ServiceUserMaster'));
const DataServiceMaster = lazy(() => import('./pages/webServiceMasterPgs/DataServiceMaster'));
const WidgetMaster = lazy(() => import('./pages/dashboardMasterPgs/WidgetMaster'));
const TabMaster = lazy(() => import('./pages/dashboardMasterPgs/TabMaster'));
const DashboardMaster = lazy(() => import('./pages/dashboardMasterPgs/DashboardMaster'));

const HisRoutes = () => {

    return (
        <Routes>
            <Route exact path="/dashboard-configuration-master" name="Register Page" element={<DbConfigMaster />} />
            <Route exact path="/" name="login" element={<DbConfigMaster />} />
            <Route exact path="/parameter-master" name="login" element={<ParameterMaster />} />
            <Route exact path="/dashboard-submenu-master" name="login" element={<DbSubmenuMaster />} />
            <Route exact path="/service-user-master" name="login" element={<ServiceUserMaster />} />
            <Route exact path="/data-service-master" name="login" element={<DataServiceMaster />} />
            <Route exact path="/widget-master" name="login" element={<WidgetMaster />} />
            <Route exact path="/tab-master" name="Tab Master" element={<TabMaster />} />
            <Route exact path="/dashboard-master" name="Dashboard Master" element={<DashboardMaster />} />
            <Route exact path="/dashboard" name="Dashboard Master" element={<DashboardMst />} />
            <Route exact path="/widget" name="Dashboard Master" element={<Tabular />} />
        </Routes>
    )
}

export default HisRoutes;