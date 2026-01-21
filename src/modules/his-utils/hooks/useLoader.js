import { useContext } from 'react';
import { LoaderContext } from '../Contexts/LoaderContext';

export default function useLoader() {
  const context = useContext(LoaderContext);
  return context;
}
