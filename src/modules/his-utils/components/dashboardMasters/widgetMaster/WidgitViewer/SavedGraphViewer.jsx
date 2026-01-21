import { useEffect, useState } from 'react';
import { executeParamSQL } from '../../../../Api/parameterMaster';
import useLoader from '../../../../hooks/useLoader';
import {
  HighchartGraphs,
  InteractiveHighchartGraphs,
} from '../../../Highcharts/HighchartGraphEngine';
import { useSelector } from 'react-redux';
import { cleanUpSQL } from '../../../../App/commonFunction';

export default function SavedGraphViewer({ dataSet }) {
  //Redux States
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);

  const widgitSQL =
    dataSet?.dataSet?.lt_json?.widgitQuery || dataSet?.lt_json?.widgitQuery;

  const graphData =
    dataSet?.dataSet?.lt_json?.graphLib || dataSet?.lt_json?.graphLib;

  const pkCol = dataSet?.dataSet?.lt_json?.pkCol || dataSet?.lt_json?.pkCol;

  //local states
  const [widgitData, setWidgitData] = useState([]);
  const { showLoader, hideLoader } = useLoader();

  const fetchWidgitData = async (sqlToBeExecuted) => {
    showLoader('Getting data from DB');

    try {
      const data = await executeParamSQL(sqlToBeExecuted);
      if (!data) return;

      setWidgitData(data?.data);
    } catch (error) {
      console.error('Error fetching Widgit data:', error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const finalSQL = cleanUpSQL(widgitParams, widgitSQL, pkCol || {});

    fetchWidgitData(finalSQL);
  }, [widgitParams]);

  function renderGraph() {
    switch (graphData) {
      case 'highcharts':
        return <HighchartGraphs sql={widgitData} widgitProp={dataSet} />;
      // case 'googleCharts':
      //   return <GoogleCharts sql={widgitData} widgitProp={dataSet} />;
      // case 'superset':
      //   return <SuperSetChartEngine data={widgitData} />;
      default:
        return <div>No valid graph type selected</div>;
    }
  }

  return <div>{renderGraph()}</div>;
}

export function SavedDrilldownGraphViewer({ dataSet }) {
  //Redux States
  const widgitParams = useSelector((state) => state.widgitViewer.paramValues);

  const widgitSQL =
    dataSet?.dataSet?.lt_json?.widgitQuery || dataSet?.lt_json?.widgitQuery;

  const graphData =
    dataSet?.dataSet?.lt_json?.graphLib || dataSet?.lt_json?.graphLib;

  const pkColsData = useSelector((state) => state.drilldownConfig.pkColsData);

  //local states
  const [widgitData, setWidgitData] = useState([]);
  const { showLoader, hideLoader } = useLoader();

  const fetchWidgitData = async (sqlToBeExecuted) => {
    showLoader('Getting data from DB');

    try {
      const data = await executeParamSQL(sqlToBeExecuted);
      if (!data) return;

      setWidgitData(data?.data);
    } catch (error) {
      console.error('Error fetching Widgit data:', error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const areParamsSupplied = Object.keys(widgitParams).length === 0;

    if (areParamsSupplied && widgitSQL.includes('Para')) {
      return;
    }

    let finalSQL = areParamsSupplied
      ? widgitSQL
      : Object.keys(widgitParams).reduce((acc, key) => {
          return acc.replaceAll(key, widgitParams[key]);
        }, widgitSQL);

    if (finalSQL.includes('#PK')) {
    }

    fetchWidgitData(finalSQL);
  }, [widgitParams]);

  function renderGraph() {
    switch (graphData) {
      case 'highcharts':
        return (
          <InteractiveHighchartGraphs sql={widgitData} widgitProp={dataSet} />
        );
      // case 'googleCharts':
      //   return (
      //     <InteractiveGoogleCharts sql={widgitData} widgitProp={dataSet} />
      //   );
      // case 'superset':
      //   return <SuperSetChartEngine data={widgitData} />;
      default:
        return <div>No valid graph type selected</div>;
    }
  }

  return <div>{renderGraph()}</div>;
}
