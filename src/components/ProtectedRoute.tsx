import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();
  let hasToken = false;
  try {
    hasToken = Boolean(
      window.localStorage.getItem('access_token') ||
      window.sessionStorage.getItem('access_token')
    );
  } catch {
    hasToken = false;
  }

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}


