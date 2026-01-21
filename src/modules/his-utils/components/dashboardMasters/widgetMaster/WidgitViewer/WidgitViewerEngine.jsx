import { useSelector } from 'react-redux';
import TabularWidgit from './TabularWidgit';
import GraphEngine from '../../../GraphEngine';
import KpiEngine from '../../../KpiEngine';
import DrilldownEngine from '../../../DrilldownMaster/DrilldownEngine';

export default function WidgitEngine() {
  const activeWidgit = useSelector((state) => state.widgitViewer?.widgitType);
  const widgitSQL = useSelector((state) => state.widgitViewer?.sqlToBeExecuted);
  const attachedParent = useSelector(
    (state) => state?.drilldownConfig?.attachedParentID
  );
  if (attachedParent || attachedParent !== null) return <DrilldownEngine />;

  switch (activeWidgit) {
    case 'Tabular':
      return <TabularWidgit widgitSQL={widgitSQL} />;
    case 'Graph':
      return <GraphEngine />;
    case 'KPI':
      return <KpiEngine widgitSQL={widgitSQL} />;
    default:
      return <h1>No widgit selected</h1>;
  }
}
