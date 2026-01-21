import { useContext } from 'react';
import { SQLEditorContext } from '../Contexts/SQLEditorContext';

export default function useSQLEditor() {
  return useContext(SQLEditorContext);
}
