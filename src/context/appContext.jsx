import { DashboardProvider } from "./dashboardContext";
import { AuthProvider } from "./authContext";
import { CodeStatsProvider } from "./codingContext";
import { ApplicationsProvider } from "./applicationsContext";
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
    <DashboardProvider>
        <ApplicationsProvider>
        <CodeStatsProvider>
      {children}
      </CodeStatsProvider>
      </ApplicationsProvider>
    </DashboardProvider>
    </AuthProvider>
  );
};