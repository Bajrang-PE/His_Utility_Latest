import { useSelector } from 'react-redux';
import HighchartGraphEngine from './Highcharts/HighchartGraphEngine';
import { useContext, useEffect, useState } from 'react';
import useLoader from '../hooks/useLoader';
import { executeParamSQL } from '../Api/parameterMaster';
import { HISContext } from '../contextApi/HISContext';
import { fetchQueryDataPreview } from '../utils/commonFunction';
// import GoogleChartsEngine from './Googlecharts/GoogleChartsEngine';
// import SuperSetChartEngine from './Superset/SupersetChartEngine';

export default function GraphEngine() {
  //Redux States
  const graphData = useSelector((state) => state.widgitViewer.graphDetails);
  const widgitSQL = useSelector((state) => state.widgitViewer.sqlToBeExecuted);
  const { paramsValues, isSearchQuery, setIsSearchQuery, } = useContext(HISContext);

  //local states
  const [widgitData, setWidgitData] = useState([]);
  const { showLoader, hideLoader } = useLoader();

  const fetchWidgitData = async (sql) => {
    showLoader('Getting data from DB');

    try {
      const data = await fetchQueryDataPreview(sql, paramsValues?.tabParams);
      if (data?.status === 1) {
        setWidgitData(data?.data);
        hideLoader();
        setIsSearchQuery(false)
      } else {
        setWidgitData([]);
        hideLoader();
        setIsSearchQuery(false)
      }

    } catch (error) {
      console.error('Error fetching Widgit data:', error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchWidgitData(widgitSQL);
  }, [widgitSQL, isSearchQuery]);

  function renderGraph() {
    switch (graphData?.graphLib) {
      case 'highchart':
        return <HighchartGraphEngine data={widgitData} />;
      // case 'googleCharts':
      //   return <GoogleChartsEngine data={widgitData} />;
      // case 'superset':
      //   return <SuperSetChartEngine data={widgitData} />;
      default:
        return <div>No valid graph type selected</div>;
    }
  }

  return <div>{renderGraph()}</div>;
}
