import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import Dashboard from "../dashboard/Dashboard";
import Loader from "../common/Loader";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const redirecting = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirecting.current) {
      redirecting.current = true;
      loginWithRedirect({
        appState: { returnTo: "/dashboard" },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return <Loader text="Preparing your dashboard..." />;
  }

  return <Dashboard />;
}
