import React, { createContext, useContext } from 'react';

const AppStateContext = createContext();

export const useAppStateContext = () => useContext(AppStateContext);

export const AppStateProvider = ({ children, value }) => {
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};