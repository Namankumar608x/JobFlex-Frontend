import { createContext, useContext, useState } from "react";

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
const [data,setData]=useState([]);

  return (
    <ApplicationsContext.Provider value={{ data,setData }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

// custom hook (important for clean usage)
export const useApplications= () => {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error("useApplications must be used inside applicationsProvider");
  }

  return context;
};