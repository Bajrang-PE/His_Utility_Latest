import { useSelector } from 'react-redux';
import TabGenerator from './TabGenerator';

export default function Tab() {
  //Redux State
  const tabData = useSelector((state) => state.tab.tabData);

  return Object.keys(tabData).length === 0 ? (
    <h1>Please Select Tab To Continue</h1>
  ) : (
    <TabGenerator />
  );
}
