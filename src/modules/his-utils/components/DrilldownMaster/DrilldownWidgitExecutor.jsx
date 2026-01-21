import { useSelector } from 'react-redux';
import DrilldownWidgitEngine from './DrilldownWidgitEngine';

//to make this function work,
//Change parent widgit redux state after drilldown is clicked to compute next widgit in drilldown
export default function DrilldownWidgitExecutor() {
  const widgitToBeExecuted = useSelector(
    (state) => state.drilldownConfig.widgitToBeExecuted
  );

  if (Object.keys(widgitToBeExecuted).length === 0) return;

  return <DrilldownWidgitEngine dataSet={widgitToBeExecuted} />;
}
