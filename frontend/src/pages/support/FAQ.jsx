import Header from '../../components/Header';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: "¿Cuáles son los métodos de pago aceptados?", a: "Aceptamos tarjetas de crédito, débito (PSE), Nequi, Daviplata y pagos en efectivo en la entrega." },
    { q: "¿Cuánto tarda en llegar mi pedido?", a: "En Neiva el tiempo estimado de entrega es de 2 a 4 días hábiles." },
    { q: "¿Tienen tiendas físicas?", a: "Actualmente operamos de manera 100% virtual con despachos desde nuestra bodega principal en Neiva, Huila." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Preguntas Frecuentes</h1>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}