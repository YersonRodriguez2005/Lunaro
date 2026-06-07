import Header from '../../components/Header';
import { Truck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Políticas de Envío</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Tiempos de Despacho</h2>
            <p>Todos los pedidos confirmados antes de las 2:00 PM se procesan el mismo día hábil. Los pedidos realizados fines de semana o festivos se procesan el siguiente día hábil.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Costos de Envío</h2>
            <p>El costo de envío estándar a nivel nacional es de $5.000 COP. Ofrecemos <strong>envío gratuito</strong> en todas las compras superiores a $100.000 COP.</p>
          </section>
        </div>
      </main>
    </div>
  );
}