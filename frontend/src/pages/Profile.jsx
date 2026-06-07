import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { getProfileRequest, updateProfileRequest } from '../api/users';
import { getMyOrdersRequest } from '../api/orders';
import { useAuthStore } from '../store/authStore';
import {
  User, Package, CheckCircle, Clock, ChevronRight,
  Phone, MapPin, Mail, Loader2, AlertCircle
} from 'lucide-react';

const INPUT_CLASS = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200';

function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const map = {
    paid: { label: 'Pagado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    pending: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
    shipped: { label: 'Enviado', cls: 'bg-blue-50 text-blue-700 border-blue-100' },
    cancelled: { label: 'Cancelado', cls: 'bg-red-50 text-red-600 border-red-100' },
  };
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

const tabs = [
  { id: 'datos', label: 'Datos personales', icon: User },
  { id: 'pedidos', label: 'Mis pedidos', icon: Package },
];

export default function Profile() {
  const location = useLocation();
  const { user: authUser, loginSuccess } = useAuthStore();

  const [activeTab, setActiveTab] = useState('datos');
  const [feedback, setFeedback] = useState(
    location.state?.message
      ? { type: 'success', text: location.state.message }
      : null
  );
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          getProfileRequest(),
          getMyOrdersRequest()
        ]);
        setFormData({
          name: profileRes.data.name || '',
          phone: profileRes.data.phone || '',
          address: profileRes.data.address || ''
        });
        setOrders(ordersRes.data);
      } catch {
        setFeedback({ type: 'error', text: 'Error al cargar la información del servidor.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (location.state?.message) {
      window.history.replaceState({}, document.title);
      setTimeout(() => setFeedback(null), 5000);
    }
  }, [location.state]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updatePromise = updateProfileRequest(formData);

    toast.promise(updatePromise, {
      loading: 'Guardando cambios...',
      success: 'Tu perfil ha sido actualizado correctamente.',
      error: 'No se pudo actualizar la información.'
    });

    setSaving(true);
    setFeedback(null);

    try {
      await updateProfileRequest(formData);
      setFeedback({ type: 'success', text: 'Perfil actualizado correctamente.' });
      loginSuccess({ ...authUser, name: formData.name });
      setTimeout(() => setFeedback(null), 4000);
    } catch (error) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Error al actualizar.' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const firstName = authUser?.name?.split(' ')[0] || 'Usuario';
  const initials = authUser?.name
    ?.split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        <BackButton className="mb-6" />

        {/* Header perfil */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-lg font-bold text-white">{initials}</span>
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Hola, {firstName}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{authUser?.email}</p>
          </div>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div className={`mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border ${feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-600 border-red-100'
            }`}>
            {feedback.type === 'success'
              ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-left leading-snug">{label}</span>
                  {activeTab !== id && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto text-slate-300" />
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Contenido ── */}
          <div className="md:col-span-3">

            {/* PESTAÑA: Datos personales */}
            {activeTab === 'datos' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
                <h2 className="text-base font-bold text-slate-800 mb-6">
                  Información personal
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                  <FormField label="Nombre completo" icon={User}>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={INPUT_CLASS}
                      placeholder="María García"
                    />
                  </FormField>

                  <FormField label="Correo electrónico" icon={Mail}>
                    <input
                      type="email"
                      value={authUser?.email || ''}
                      disabled
                      className={`${INPUT_CLASS} opacity-60 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-400 mt-1">El correo no se puede modificar.</p>
                  </FormField>

                  <FormField label="Teléfono" icon={Phone}>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={INPUT_CLASS}
                      placeholder="300 123 4567"
                    />
                  </FormField>

                  <FormField label="Dirección de envío" icon={MapPin}>
                    <textarea
                      rows={3}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className={INPUT_CLASS}
                      placeholder="Calle, Carrera, Barrio, Ciudad..."
                    />
                  </FormField>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* PESTAÑA: Pedidos */}
            {activeTab === 'pedidos' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-800">Historial de pedidos</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'} realizadas
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">Aún no tienes pedidos registrados.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {orders.map(order => (
                      <div key={order.id} className="p-5 lg:p-6 hover:bg-slate-50/50 transition-colors">
                        {/* Cabecera orden */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Orden #{order.id}
                              </span>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDate(order.created_at)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Total</p>
                            <p className="text-lg font-bold text-slate-900">
                              ${parseFloat(order.total).toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>

                        {/* Items de la orden */}
                        <div className="space-y-3">
                          {order.items.map(item => (
                            <div
                              key={item.item_id}
                              className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-slate-800 shrink-0">
                                ${parseFloat(item.subtotal).toLocaleString('es-CO')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}