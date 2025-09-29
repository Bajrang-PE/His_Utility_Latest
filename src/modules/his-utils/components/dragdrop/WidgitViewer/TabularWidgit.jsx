import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import useLoader from '../../Hooks/useLoader';
// import { executeParamSQL } from '../../Api/parameterMaster';
import { Table } from '../Table';
import axios from 'axios';

export default function TabularWidgit() {
  //Redux States
  const widgitSQL = useSelector((state) => state.widgitViewer.sqlToBeExecuted);
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);
  const widgitStyle = useSelector((state) => state.widgitViewer.widgitStyle);

  //Loader
  // const { showLoader, hideLoader } = useLoader();

  //Table Data
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const areParamsSupplied = Object.keys(widgitParams).length === 0;

    if (areParamsSupplied && widgitSQL.includes('Para')) {
      return;
    }

    const finalSQL = areParamsSupplied
      ? widgitSQL
      : Object.keys(widgitParams).reduce((acc, key) => {
          return acc.replaceAll(key, widgitParams[key]);
        }, widgitSQL);

    fetchWidgitData(finalSQL);
  }, [widgitParams]);

  async function fetchWidgitData(sql) {
    // showLoader('Getting data from DB');
    const data = await executeParamSQL(sql);

    if (!data) return;

    setTableData(data?.data);
    // hideLoader();
  }

  return <Table tableData={tableData} widgitStyle={widgitStyle} />;
}

const dashboardAPI = axios.create({
  baseURL: "http://10.226.26.247:8025",
  withCredentials: true,
});

export async function executeParamSQL(sql) {
  const response = await dashboardAPI.post(
    'http://10.226.26.247:8025/api/v1/preview-parameter',
    {
      sqlQuery: sql,
    }
  );

  if (response.data?.status === 0) {
    WarningAlert('Warning', response.data?.message);
    return [];
  }

  if (!response.data.status || response.data?.status === -1) {
    FailureAlert(response.message, response.data?.message);
    return [];
  }

  return response.data;
}