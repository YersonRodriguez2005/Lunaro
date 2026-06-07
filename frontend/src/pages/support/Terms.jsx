import Header from '../../components/Header';
import { ShieldCheck } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Términos y Condiciones</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed text-sm">
          <p>Bienvenido a Lunaro. Al acceder y utilizar este sitio web, aceptas estar sujeto a los siguientes términos y condiciones.</p>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Propiedad Intelectual</h2>
            <p>Todo el contenido alojado en este sitio web (textos, gráficos, logos, imágenes) es propiedad exclusiva de Lunaro y está protegido por las leyes de derechos de autor de Colombia.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Privacidad y Tratamiento de Datos</h2>
            <p>Tus datos personales se recopilan exclusivamente para el procesamiento de tus pedidos y la mejora de tu experiencia. No compartimos ni vendemos tu información financiera a terceros bajo ninguna circunstancia.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Disponibilidad y Precios</h2>
            <p>Nos reservamos el derecho de modificar los precios y la disponibilidad de los productos sin previo aviso. En caso de presentarse un error tipográfico en el precio de un artículo, contactaremos al cliente para confirmar si desea proceder con el valor correcto o cancelar su orden.</p>
          </section>
        </div>
      </main>
    </div>
  );
}