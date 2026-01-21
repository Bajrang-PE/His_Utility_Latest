import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DrilldownWidgitExecutor from './DrilldownWidgitExecutor';
import {
  setRootWidgit,
  setWidgitToExecute,
} from '../../Features/Drilldown/drilldownSlice';

export default function DrilldownEngine() {
  const dispatch = useDispatch();
  const allWidgits = useSelector((state) => state.drilldownConfig.allWidgits);
  const parentID = useSelector(
    (state) => state.drilldownConfig.attachedParentID
  );

  let rootParent = null;

  if (parentID) {
    rootParent = findRootParent(allWidgits, parentID);
  }

  useEffect(() => {
    if (!rootParent) return;
    dispatch(setRootWidgit(rootParent));
    dispatch(setWidgitToExecute(rootParent));
    // eslint-disable-next-line
  }, [rootParent]);

  if (!parentID) return null;
  return <DrilldownWidgitExecutor />;
}

function findRootParent(widgitList, parentID) {
  const parentWidgit = widgitList.find(
    (item) => String(item.id) === String(parentID)
  );
  if (!parentWidgit) return null;

  const rootParentID = Number(parentWidgit.depends_on);
  if (!rootParentID) return parentWidgit;

  return findRootParent(widgitList, rootParentID);
}
