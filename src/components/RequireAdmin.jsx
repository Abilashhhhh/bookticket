import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function RequireAdmin({ children }) {
  const { currentUser } = useApp();
  if (!currentUser || currentUser.role !== 'Admin') {
    return <Navigate to="/login" replace state={{ adminRequired: true }} />;
  }
  return children;
}
