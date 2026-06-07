import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { useCartStore } from '../store/cartStore';
import { createOrderRequest } from '../api/checkout';
import { ShieldCheck, Loader2, Lock, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';

const INPUT_CLASS = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200';

// Formatea número de tarjeta con espacios cada 4 dígitos
function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

// Formatea expiración MM/AA
function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// Detecta tipo de tarjeta por el primer dígito
function detectCardType(number) {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return null;
}

function CardBrand({ type }) {
  if (!type) return null;
  const labels = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
      {labels[type]}
    </span>
  );
}

export default function Checkout() {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderOpen, setOrderOpen] = useState(false);

  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvc: '' });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cardType = detectCardType(cardData.number);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') {
      setCardData(prev => ({ ...prev, number: formatCardNumber(value) }));
    } else if (name === 'expiry') {
      setCardData(prev => ({ ...prev, expiry: formatExpiry(value) }));
    } else if (name === 'cvc') {
      setCardData(prev => ({ ...prev, cvc: value.replace(/\D/g, '').slice(0, 4) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentToken: `tok_sandbox_${Math.random().toString(36).substr(2, 9)}`
      };
      await createOrderRequest(payload);
      clearCart();
      navigate('/profile', { state: { message: '¡Pago exitoso! Tu orden ha sido registrada.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <BackButton className="mb-6" />

        {/* Título */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pago seguro
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Conexión cifrada de 256 bits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Formulario (izquierda, mayor peso) ── */}
          <div className="lg:col-span-3 space-y-6">

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3.5 rounded-xl text-sm">
                ⚠ {error}
              </div>
            )}

            {/* Tarjeta de pago */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Datos de la tarjeta
                </h2>
                {/* Logos de tarjetas */}
                <div className="ml-auto flex items-center gap-2">
                  {['VISA', 'MC', 'AMEX'].map(brand => (
                    <span key={brand} className={`text-[9px] font-black px-1.5 py-0.5 rounded border transition-all ${
                      (brand === 'VISA' && cardType === 'visa') ||
                      (brand === 'MC' && cardType === 'mastercard') ||
                      (brand === 'AMEX' && cardType === 'amex')
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'text-slate-300 border-slate-200'
                    }`}>
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePayment} className="p-6 space-y-4">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nombre en la tarjeta
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    autoComplete="cc-name"
                    value={cardData.name}
                    onChange={handleChange}
                    placeholder="Ej. María García"
                    className={INPUT_CLASS}
                  />
                </div>

                {/* Número */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Número de tarjeta
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      name="number"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      value={cardData.number}
                      onChange={handleChange}
                      placeholder="0000 0000 0000 0000"
                      className={`${INPUT_CLASS} tracking-widest pr-16 font-mono`}
                    />
                    <CardBrand type={cardType} />
                  </div>
                </div>

                {/* Expiración + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Vencimiento
                    </label>
                    <input
                      required
                      type="text"
                      name="expiry"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      value={cardData.expiry}
                      onChange={handleChange}
                      placeholder="MM/AA"
                      className={`${INPUT_CLASS} font-mono`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      CVC / CVV
                    </label>
                    <input
                      required
                      type="text"
                      name="cvc"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      value={cardData.cvc}
                      onChange={handleChange}
                      placeholder="•••"
                      className={`${INPUT_CLASS} font-mono tracking-widest`}
                    />
                  </div>
                </div>

                {/* Botón pagar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2.5 py-4 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/25 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Procesando pago...</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Pagar ${total.toLocaleString('es-CO')}</>
                  )}
                </button>

                {/* Trust bar */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Encriptación SSL de 256 bits — tus datos están protegidos
                </div>
              </form>
            </div>
          </div>

          {/* ── Resumen pedido (derecha) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              {/* Toggle en móvil */}
              <button
                onClick={() => setOrderOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 lg:cursor-default"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Tu pedido
                  </span>
                  <span className="text-xs text-slate-400">({totalItems} artículos)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    ${total.toLocaleString('es-CO')}
                  </span>
                  <span className="lg:hidden text-slate-400">
                    {orderOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </div>
              </button>

              {/* Items */}
              <div className={`border-t border-slate-100 overflow-hidden transition-all duration-300 ${
                orderOpen ? 'max-h-125' : 'max-h-0 lg:max-h-125'
              }`}>
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {cartItems.map(item => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase">{item.size}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-800 shrink-0">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Envío</span>
                    <span className="text-emerald-600 font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">
                      ${total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}