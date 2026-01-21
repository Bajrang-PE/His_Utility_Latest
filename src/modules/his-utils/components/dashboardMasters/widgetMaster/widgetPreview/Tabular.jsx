import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useLoader from '../../../../hooks/useLoader';
import { executeParamSQL } from '../../../../Api/parameterMaster';
import { Table } from '../../../dragdrop/Table';

export default function Tabular({ widgitSQL }) {
  //Redux States
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);
  const widgitStyle = useSelector((state) => state.widgitViewer.widgitStyle);

  //Loader
  const { showLoader, hideLoader } = useLoader();

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
    showLoader('Getting data from DB');
    const response = await executeParamSQL(sql);
    if (!response) return;

    setTableData(response?.data);
    hideLoader();
  }

  return <Table tableData={tableData} widgitStyle={widgitStyle} />;
}
