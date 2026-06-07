import Header from '../../components/Header';
import { RefreshCcw } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <RefreshCcw className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Cambios y Devoluciones</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed">
          <p>En Lunaro queremos que estés 100% satisfecho con tu compra. Si no es así, te facilitamos el proceso de cambio.</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Plazo:</strong> Tienes hasta 3 días desde la recepción de tu pedido para solicitar un cambio.</li>
            <li><strong>Condiciones:</strong> Las prendas deben estar sin uso, sin lavar, con todas sus etiquetas originales adheridas y en su empaque original.</li>
            <li><strong>Proceso:</strong> Escríbenos a soporte_lunaro@gmail.com con tu número de pedido y el motivo del cambio. Te enviaremos una guía para retornar el paquete.</li>
            <li><strong>Costos:</strong> El primer cambio por talla no tiene costo de domicilio. Los cambios posteriores o devoluciones por retracto corren por cuenta del cliente.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}