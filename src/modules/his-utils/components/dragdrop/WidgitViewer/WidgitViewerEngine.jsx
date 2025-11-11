import { useSelector } from 'react-redux';
import TabularWidgit from './TabularWidgit';

export default function WidgitEngine() {
  //Global Redux States
  const activeWidit = useSelector((state) => state.widgitViewer.widgitType);

  switch (activeWidit) {
    case 'table':
      return <TabularWidgit />;
  }
}
