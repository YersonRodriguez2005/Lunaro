import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      showSessionWarning: false,

      setShowSessionWarning: (value) => set({ showSessionWarning: value }),

      // Función para actualizar solo el token sin borrar el resto
      updateToken: (newToken) => set({ token: newToken, showSessionWarning: false }),

      // Acción a ejecutar cuando el login en la API es exitoso
      loginSuccess: (userData) => {
        set({ user: userData, isAuthenticated: true });
      },

      // Acción para cerrar sesión y limpiar el estado
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);