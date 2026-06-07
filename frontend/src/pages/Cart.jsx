import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import BackButton from '../components/BackButton';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Truck } from 'lucide-react';

// Item de carrito individual
function CartItem({ item, onRemove, onQuantity }) {
  return (
    <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all duration-200">
      <Link
        to={`/product/${item.productId}`}
        className="shrink-0 w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 block"
      >
        <img
          src={item.image_urls?.[0] || item.image_url || 'https://placehold.co/400x400/e2e8f0/475569?text=Sin+Imagen'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info + controles */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/product/${item.productId}`}
              className="text-sm sm:text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
            >
              {item.name}
            </Link>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                {item.size}
              </span>
              <span className="text-xs text-slate-400">
                ${parseFloat(item.price).toLocaleString('es-CO')} c/u
              </span>
            </div>
          </div>

          {/* Eliminar */}
          <button
            onClick={() => {
              onRemove(item.productId, item.size);
              toast.info('Producto eliminado del carrito');
            }}
            className="shrink-0 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            aria-label="Eliminar del carrito"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Cantidad + subtotal */}
        <div className="flex items-center justify-between mt-3">
          {/* Stepper */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onQuantity(item, 'dec')}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-colors"
              aria-label="Reducir"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
            <button
              onClick={() => onQuantity(item, 'inc')}
              disabled={item.quantity >= item.maxStock}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-colors"
              aria-label="Aumentar"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Subtotal */}
          <p className="text-base font-bold text-slate-900">
            ${(item.price * item.quantity).toLocaleString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShipping = total >= 100000;

  const handleQuantity = (item, type) => {
    if (type === 'dec' && item.quantity > 1)
      updateQuantity(item.productId, item.size, item.quantity - 1);
    if (type === 'inc' && item.quantity < item.maxStock)
      updateQuantity(item.productId, item.size, item.quantity + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        <BackButton className="mb-6" />

        {/* Título */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Tu carrito
          </h1>
          {cartItems.length > 0 && (
            <p className="text-slate-500 text-sm mt-1">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ── Estado vacío ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 px-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Tu carrito está vacío</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
              Aún no has añadido ninguna prenda. ¡Explora el catálogo!
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              Explorar catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Lista de items ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3">
              {cartItems.map(item => (
                <CartItem
                  key={`${item.productId}-${item.size}`}
                  item={item}
                  onRemove={removeFromCart}
                  onQuantity={handleQuantity}
                />
              ))}

              {/* Link continuar comprando */}
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  ← Continuar comprando
                </Link>
              </div>
            </div>

            {/* ── Resumen ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5">
                  Resumen del pedido
                </h2>

                {/* Líneas de costo */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</span>
                    <span className="font-medium text-slate-800">${total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 shrink-0" />
                      Envío
                    </span>
                    <span className={`font-semibold ${freeShipping ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {freeShipping ? 'Gratis' : '$5.000'}
                    </span>
                  </div>

                  {/* Barra progreso hacia envío gratis */}
                  {!freeShipping && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Agrega ${(100000 - total).toLocaleString('es-CO')} más para envío gratis</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / 100000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-5" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Proceder al pago
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Trust badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Pago seguro
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Precio final
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}