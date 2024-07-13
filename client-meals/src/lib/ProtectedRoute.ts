import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

// Define types for roles
type UserRole = 'Admin' | 'User';

// HOC to guard routes based on role
export const ProtectedRoute = ({
  allowedRoles,
  ...rest
}: { allowedRoles: UserRole[] } & RouteProps) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to login or unauthorized page
    return <Redirect to="/unauthorized" />;
  }

  return <Route {...rest} />;
};