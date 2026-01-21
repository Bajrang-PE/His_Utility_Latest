import React, { createContext, useRef, useState } from 'react';

const SQLEditorContext = createContext();

function SQLEditorProvider({ children }) {
  const sqlRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <SQLEditorContext.Provider value={{ sqlRef, isVisible, setIsVisible }}>
      {children}
    </SQLEditorContext.Provider>
  );
}

export { SQLEditorContext, SQLEditorProvider };
