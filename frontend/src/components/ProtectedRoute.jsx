import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Verificación de Autenticación General
  if (!isAuthenticated) {
    // El atributo "replace" borra el historial para que no puedan volver con el botón "Atrás"
    return <Navigate to="/login" replace />;
  }

  // 2. Verificación de Rol Administrativo
  if (adminOnly && user?.role !== 'admin') {
    // Si un cliente normal intenta acceder a /admin, lo enviamos al inicio
    return <Navigate to="/" replace />; 
  }

  // 3. Si pasa todas las pruebas, renderiza los componentes hijos
  return <Outlet />;
}