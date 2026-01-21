import { useDispatch, useSelector } from 'react-redux';
import KpiEngine, { SavedKPIViewer } from '../KpiEngine';
import SavedGraphViewer, {
  SavedDrilldownGraphViewer,
} from '../../components/dashboardMasters/widgetMaster/WidgitViewer/SavedGraphViewer';
import TabularWidgit, { DrilldownTabular } from '../../components/dashboardMasters/widgetMaster/WidgitViewer/TabularWidgit';
import GraphEngine from '../GraphEngine';
import {
  setGraphDetails,
  setSQL,
} from '../../Features/WidgitEngine/WidgitViewerSlice';
import { cleanUpSQL } from '../../App/commonFunction';
import Tabular from '../../components/dashboardMasters/widgetMaster/widgetPreview/Tabular';
import { useEffect, useMemo } from 'react';
import { PrimaryButton } from '../Buttons';
import {
  setPKColsData,
  setWidgitToExecute,
} from '../../Features/Drilldown/drilldownSlice';

const checkTempID = /^[0-9]+$/;

export default function DrilldownWidgetEngine({ dataSet, isEditing = false }) {
  const dispatch = useDispatch();
  const pkColsData = useSelector((state) => state.drilldownConfig.pkColsData);
  const rootParent = useSelector((state) => state.drilldownConfig.rootWidgit);

  // Derived values
  const ltJson = dataSet?.dataSet?.lt_json || dataSet?.lt_json || {};
  const { widgitType, widgitQuery, graphData } = ltJson;
  const isDrilldown = Object.keys(dataSet?.drilldown_ids || {}).length > 0;
  const doesDependsOnOther = dataSet?.depends_on;
  const isTempID = checkTempID.test(String(dataSet?.id));
  const pkColDataForSelectedWidgit = pkColsData[String(dataSet?.id)];

  // Memoized cleaned SQL
  const cleanedSQL = useMemo(
    () => cleanUpSQL({}, widgitQuery, pkColDataForSelectedWidgit),
    [widgitQuery, pkColDataForSelectedWidgit]
  );

  // Side effects for new widgets
  useEffect(() => {
    if (!isDrilldown && !isTempID && widgitType === 'graph') {

      dispatch(setSQL(cleanedSQL));
      dispatch(setGraphDetails(graphData));
    }
  }, [isDrilldown, isTempID, widgitType, graphData, cleanedSQL, dispatch]);

  // Function to determine what widget to render
  const renderWidget = () => {
    if (!isDrilldown && !isTempID) {
      switch (widgitType) {
        case 'graph':
          return <GraphEngine />;
        case 'table':
          return <TabularWidgit widgitSQL={cleanedSQL} />;
        case 'kpi':
          return <KpiEngine widgitSQL={cleanedSQL} />;
        default:
          return null;
      }
    }

    if (!isDrilldown && isTempID) {
      switch (widgitType) {
        case 'graph':
          return <SavedGraphViewer dataSet={dataSet} />;
        case 'table':
          return <Tabular widgitSQL={cleanedSQL} />;
        case 'kpi':
          return <SavedKPIViewer dataSet={dataSet} isEditing={isEditing} />;
        default:
          return null;
      }
    }

    // Drilldown mode
    switch (widgitType) {
      case 'graph':
        return <SavedDrilldownGraphViewer dataSet={dataSet} />;
      case 'table':
        return <DrilldownTabular widgitSQL={cleanedSQL} dataSet={dataSet} />;
      default:
        return null;
    }
  };

  function handleParentRender() {
    dispatch(setWidgitToExecute(rootParent));
    dispatch(setPKColsData({}));
  }

  return (
    <div className="drilldown-widget-container" style={{ textAlign: 'center' }}>
      {renderWidget()}
      {doesDependsOnOther && (
        <PrimaryButton
          buttonText={'Back To Parent'}
          handler={handleParentRender}
        />
      )}
    </div>
  );
}
