import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import SessionModal from './components/SessionModal';
import Footer from './components/Footer';
import FAQ from './pages/support/FAQ';
import Shipping from './pages/support/Shipping';
import Returns from './pages/support/Returns';
import Terms from './pages/support/Terms';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      {/* Contenedor principal Flexbox para manejar el layout de toda la app */}
      <div className="flex flex-col min-h-screen">
        
        {/* flex-grow empuja todo lo que esté debajo (el Footer) hacia el final de la pantalla */}
        <main className="grow">
          <Routes>
            {/* Nivel 1: Rutas Públicas */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/terms" element={<Terms />} />

            {/* Nivel 2: Rutas Privadas (Clientes y Administradores) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Nivel 3: Rutas Privadas (SOLO Administradores) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminPanel/>} />
            </Route>
          </Routes>
        </main>

        {/* Footer inyectado globalmente al final del layout */}
        <Footer />
      </div>

      {/* Modal global, fuera del flujo normal del documento para evitar problemas de z-index */}
      <SessionModal />

      {/* Proveedor de Notificaciones Personalizado */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-white text-slate-900 border-slate-200 shadow-xl rounded-xl font-medium',
          classNames: {
            success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
            error: 'border-red-200 bg-red-50 text-red-700',
            warning: 'border-amber-200 bg-amber-50 text-amber-700',
            info: 'border-indigo-200 bg-indigo-50 text-indigo-700',
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;