import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogIn, UserPlus, LogOut, X, Menu, Package } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useSearchStore } from '../store/searchStore';

export default function Header() {
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.cartItems);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const firstName = user?.name?.split(' ')[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
          : 'bg-white border-b border-slate-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* 1. SECCIÓN IZQUIERDA (Logo y Catálogo) */}
            <div className="flex items-center gap-4 flex-1 justify-start">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <Link
                to="/"
                className="flex items-center group shrink-0"
                aria-label="Ir al inicio de Lunaro"
              >
                <img
                  src="/logo.png"
                  alt="Logotipo de Lunaro"
                  className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <nav className="hidden lg:block shrink-0">
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
                >
                  Catálogo
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </nav>
            </div>

            {/* 2. SECCIÓN CENTRAL (Buscador) */}
            <div className="hidden sm:flex flex-1 justify-center px-4">
              <form onSubmit={handleSearch} className="w-full max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* 3. SECCIÓN DERECHA (Acciones y Perfil) */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="hidden sm:block text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-full transition-all duration-200"
                    >
                      Admin
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    className="relative p-2 sm:p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-200"
                    aria-label={`Carrito, ${cartCount} artículos`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 min-w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full px-1">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-100 ml-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-full transition-all duration-200"
                      aria-label="Perfil y Pedidos"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        {/* Ícono renderizado como etiqueta JSX válida */}
                        <Package className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 hidden md:block">
                        {firstName}
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-50 transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2 rounded-full transition-all duration-300 shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:block">Regístrate</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu (Intacto) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 ${mobileMenuOpen ? 'max-h-120' : 'max-h-0'
            }`}
        >
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <nav className="px-4 pb-4 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Catálogo
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <User className="h-4 w-4" /> Mi Perfil ({firstName})
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Panel Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <LogIn className="h-4 w-4" /> Iniciar Sesión
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-indigo-600 transition-colors">
                  <UserPlus className="h-4 w-4" /> Regístrate
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Announcement bar — Corregido: Ahora está arriba del todo */}
      <div className="bg-slate-900 text-slate-300 text-center py-2 text-xs tracking-widest uppercase font-medium">
        Envío gratuito en compras mayores a $100.000
      </div>
    </>
  );
}