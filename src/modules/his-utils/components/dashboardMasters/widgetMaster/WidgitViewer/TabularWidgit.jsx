import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useLoader from '../../../../hooks/useLoader';
import { executeParamSQL } from '../../../../Api/parameterMaster';
import { DrilldownTable, Table } from '../../../dragdrop/Table';
import { cleanUpSQL } from '../../../../App/commonFunction';
import { HISContext } from '../../../../contextApi/HISContext';
import { fetchQueryDataPreview } from '../../../../utils/commonFunction';

export default function TabularWidgit({ widgitSQL }) {
  //Redux States
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);
  const widgitStyle = useSelector((state) => state.widgitViewer.widgitStyle);

  const { paramsValues, isSearchQuery, setIsSearchQuery, } = useContext(HISContext);


  //Loader
  const { showLoader, hideLoader } = useLoader();

  //Table Data
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // const finalSQL = cleanUpSQL(widgitParams, widgitSQL, {});

    fetchWidgitData(widgitSQL);

  }, [widgitParams, widgitSQL, isSearchQuery]);

  async function fetchWidgitData(sql) {
    showLoader('Getting data from DB');
    const data = await fetchQueryDataPreview(sql, paramsValues?.tabParams);

    if (data?.status === 1) {
      setTableData(data?.data);
      hideLoader();
      setIsSearchQuery(false)
    } else {
      setTableData([]);
      hideLoader();
      setIsSearchQuery(false)

    }

  }

  return <Table tableData={tableData} widgitStyle={widgitStyle} />;
}

export function DrilldownTabular({ widgitSQL, dataSet }) {
  //Redux States
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);
  const widgitStyle = useSelector((state) => state.widgitViewer.widgitStyle);
  const pkColsData = useSelector((state) => state.drilldownConfig.pkColsData);

  //Loader
  const { showLoader, hideLoader } = useLoader();

  //Table Data
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const finalSQL = cleanUpSQL(widgitParams, widgitSQL, pkColsData);

    fetchWidgitData(finalSQL);
  }, [widgitParams, pkColsData, widgitSQL]);

  async function fetchWidgitData(sql) {
    showLoader('Getting data from DB');
    const data = await executeParamSQL(sql);

    if (!data) return;

    setTableData(data?.data);
    hideLoader();
  }

  return (
    <DrilldownTable
      tableData={tableData}
      widgitStyle={widgitStyle}
      dataSet={dataSet}
    />
  );
}
