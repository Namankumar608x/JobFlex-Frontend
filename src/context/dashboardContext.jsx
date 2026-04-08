import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    accepted: 0,
    rejected: 0
  });

  return (
    <DashboardContext.Provider value={{ stats, setStats }}>
      {children}
    </DashboardContext.Provider>
  );
};

// custom hook (important for clean usage)
export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }

  return context;
};