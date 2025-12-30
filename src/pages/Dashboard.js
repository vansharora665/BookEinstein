import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "../dashboard/Dashboard";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return <Dashboard />;
}
