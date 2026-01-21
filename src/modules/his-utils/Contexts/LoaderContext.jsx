// context/LoaderContext.js
import { createContext, useState } from 'react';
import GlobalLoader from '../components/Loader';


const LoaderContext = createContext();

function LoaderProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoader = (msg = 'Loading...') => {
    setMessage(msg);
    setVisible(true);
  };

  const hideLoader = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <GlobalLoader visible={visible} message={message} />
    </LoaderContext.Provider>
  );
}

export { LoaderProvider, LoaderContext };
