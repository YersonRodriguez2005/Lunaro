import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Columna 1: Marca y Redes */}
          <div className="space-y-4">
            <Link
                to="/"
                className="flex items-center group shrink-0"
                aria-label="Ir al inicio de Lunaro"
              >
                <img
                  src="/logo_dark.png"
                  alt="Logotipo de Lunaro"
                  className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Tu destino para descubrir las últimas tendencias. Calidad, estilo y envíos seguros a toda Colombia.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Instagram SVG nativo */}
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook SVG nativo */}
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Twitter SVG nativo */}
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Explorar</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Catálogo</Link></li>
              <li><Link to="/cart" className="text-slate-400 hover:text-white transition-colors text-sm">Carrito de Compras</Link></li>
              <li><Link to="/profile" className="text-slate-400 hover:text-white transition-colors text-sm">Mi Cuenta</Link></li>
            </ul>
          </div>

          {/* Columna 3: Soporte y Políticas */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Soporte</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-slate-400 hover:text-white transition-colors text-sm">Preguntas Frecuentes</Link></li>
              <li><Link to="/shipping" className="text-slate-400 hover:text-white transition-colors text-sm">Políticas de Envío</Link></li>
              <li><Link to="/returns" className="text-slate-400 hover:text-white transition-colors text-sm">Cambios y Devoluciones</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Columna 4: Información de Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-indigo-500" />
                <span>Neiva, Huila<br/>Colombia</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-indigo-500" />
                <span>+57 321 639 3715</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-indigo-500" />
                <span>soporte_lunaro@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior (Copyright) */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © 2026 Lunaro. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Desarrollado con</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>para el mundo.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}