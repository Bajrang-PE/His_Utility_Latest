import TabularWidgit from './TabularWidgit';
import SavedGraphViewer from './SavedGraphViewer';

export default function SavedWidgitViewer({ dataSet }) {

  const widgitSQL =
    dataSet?.dataSet?.lt_json?.widgitQuery || dataSet?.lt_json?.widgitQuery;
  const widgitType =
    dataSet?.dataSet?.lt_json?.widgitType || dataSet?.lt_json?.widgitType;

  switch (widgitType) {
    case 'table':
      return <TabularWidgit widgitSQL={widgitSQL} />;
    case 'graph':
      return <SavedGraphViewer dataSet={dataSet} />;
  }
}
