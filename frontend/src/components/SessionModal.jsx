import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from '../api/axios';
import { Clock, LogOut, RefreshCw } from 'lucide-react';

const TIMEOUT = 15; // segundos antes del auto-logout

// Anillo SVG de cuenta regresiva
function CountdownRing({ timeLeft, total = TIMEOUT }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / total) * circumference;
  const color = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : '#6366f1';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80" viewBox="0 0 80 80">
        {/* Track */}
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        {/* Progress */}
        <circle
          cx="40" cy="40" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="text-2xl font-bold tabular-nums transition-colors duration-300"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

export default function SessionModal() {
  const { showSessionWarning, setShowSessionWarning, updateToken, logout } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(TIMEOUT);
  const [extending, setExtending] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const initTimeoutRef = useRef(null);

  const handleLogout = () => {
    clearInterval(timerRef.current);
    setShowSessionWarning(false);
    setTimeLeft(TIMEOUT);
    logout();
    navigate('/login');
  };

  const handleExtend = async () => {
    clearInterval(timerRef.current);
    setExtending(true);
    try {
      const res = await axios.post('/auth/refresh');
      updateToken(res.data.token);
      setShowSessionWarning(false);
      setTimeLeft(TIMEOUT);
    } catch {
      handleLogout();
    } finally {
      setExtending(false);
    }
  };

  useEffect(() => {
    if (!showSessionWarning) return;

    let currentTimer = TIMEOUT;
    // defer initial state update to avoid synchronous setState inside effect
    initTimeoutRef.current = setTimeout(() => setTimeLeft(TIMEOUT), 0);

    timerRef.current = setInterval(() => {
      currentTimer -= 1;
      if (currentTimer <= 0) {
          clearInterval(timerRef.current);
          handleLogout();
      }
      setTimeLeft(currentTimer);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSessionWarning]);

  if (!showSessionWarning) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={undefined} // No cerrar al hacer click afuera — requiere acción explícita
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Barra de progreso superior */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-1000 linear"
            style={{ width: `${(timeLeft / TIMEOUT) * 100}%` }}
          />
        </div>

        <div className="p-7">
          {/* Ícono y título */}
          <div className="flex flex-col items-center text-center">
            <CountdownRing timeLeft={timeLeft} />

            <div className="mt-4 mb-2">
              <h2
                id="session-modal-title"
                className="text-lg font-bold text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sesión a punto de expirar
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Por seguridad, tu sesión se cerrará automáticamente.
                ¿Deseas continuar navegando?
              </p>
            </div>
          </div>

          {/* Info de tiempo */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 bg-slate-50 rounded-xl py-2.5 mt-4 mb-5">
            <Clock className="h-3.5 w-3.5" />
            Cierre automático en{' '}
            <span className={`font-bold tabular-nums ${timeLeft <= 5 ? 'text-red-500' : 'text-slate-600'}`}>
              {timeLeft}s
            </span>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
            <button
              onClick={handleExtend}
              disabled={extending}
              className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {extending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {extending ? 'Renovando...' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}