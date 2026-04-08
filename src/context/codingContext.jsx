import { createContext, useContext, useState } from "react";

const codingStatsContext = createContext();

export const CodeStatsProvider = ({ children }) => {
 const [data,setData]=useState();
  return (
    <codingStatsContext.Provider value={{ data,setData }}>
      {children}
    </codingStatsContext.Provider>
  );
};

// custom hook (important for clean usage)
export const useCodeStats = () => {
  const context = useContext(codingStatsContext);

  if (!context) {
    throw new Error("useCodingStats must be used inside codingStatsProvider");
  }

  return context;
};