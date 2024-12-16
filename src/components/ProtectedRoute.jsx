import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const savedUser = Cookies.get('user');
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}