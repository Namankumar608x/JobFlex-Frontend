import { DashboardProvider } from "./dashboardContext";
import { AuthProvider } from "./authContext";
import { CodeStatsProvider } from "./codingContext";
import { ApplicationsProvider } from "./applicationsContext";
import { BlogProvider } from "./BlogContext";
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
    <DashboardProvider>
        <ApplicationsProvider>
        <CodeStatsProvider>
          <BlogProvider> 
      {children}
           </BlogProvider>
      </CodeStatsProvider>
      </ApplicationsProvider>
    </DashboardProvider>
    </AuthProvider>
  );
};