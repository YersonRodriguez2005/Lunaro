import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200 group ${className}`}
      aria-label="Retroceder a la página anterior"
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
      <span>Retroceder</span>
    </button>
  );
}