import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerRequest } from '../api/auth';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

// Indicador de fortaleza de contraseña
function PasswordStrength({ password }) {
  const checks = [
    { label: 'Mínimo 8 caracteres', pass: password.length >= 8 },
    { label: 'Una mayúscula', pass: /[A-Z]/.test(password) },
    { label: 'Un número', pass: /\d/.test(password) },
  ];

  const strength = checks.filter(c => c.pass).length;
  const strengthColors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-400'];
  const strengthLabels = ['Débil', 'Regular', 'Fuerte'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? strengthColors[strength - 1] : 'bg-slate-200'
            }`}
          />
        ))}
        <span className={`text-xs font-medium ml-1 transition-colors ${
          strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-500' : 'text-red-500'
        }`}>
          {strengthLabels[strength - 1] || ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(({ label, pass }) => (
          <span
            key={label}
            className={`flex items-center gap-1 text-xs transition-colors ${
              pass ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Check className={`h-3 w-3 ${pass ? 'opacity-100' : 'opacity-30'}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerRequest(formData);
      toast.success('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hubo un error al registrar tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Panel derecho — formulario (primero en DOM para móvil) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white order-1">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <span
                className="text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Lunaro
              </span>
            </Link>
          </div>

          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Crea tu cuenta
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors underline underline-offset-2"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3.5 rounded-xl text-sm">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="María García"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={formData.password} />
            </div>

            {/* Términos */}
            <p className="text-xs text-slate-400 leading-relaxed">
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terms" className="text-indigo-600 hover:underline">Términos de Servicio</Link>{' '}
              y{' '}
              <Link to="/privacy" className="text-indigo-600 hover:underline">Política de Privacidad</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/25 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social login */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">O regístrate con</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <svg className="h-4 w-4 fill-slate-800" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.218.682-.485 0-.236-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.891 1.529 2.341 1.087 2.912.832.09-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.308.679.919.679 1.852 0 1.335-.012 2.415-.012 2.741 0 .269.18.579.688.481C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

        </div>
      </div>

      {/* Panel izquierdo — decorativo (orden 2 en desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col items-center justify-center overflow-hidden p-12 order-2">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 70% 30%, #6366f1 0%, transparent 50%), radial-gradient(circle at 30% 70%, #0f172a 0%, transparent 50%)'
            }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)'
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <Link to="/">
            <span
              className="text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lunaro
            </span>
          </Link>

          <div className="mt-10 space-y-4">
            {[
              { icon: '✦', title: 'Envío gratuito', desc: 'En compras mayores a $100.000' },
              { icon: '◈', title: 'Devoluciones fáciles', desc: 'Hasta 30 días sin preguntas' },
              { icon: '◉', title: 'Pagos seguros', desc: 'Encriptación de nivel bancario' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 text-left"
              >
                <span className="text-indigo-400 text-xl shrink-0">{icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}