import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import { getProductByIdRequest } from '../api/products';
import { useCartStore } from '../store/cartStore';
import ProductReviews from '../components/ProductReviews';
import SEO from '../components/SEO';
import {
  ShoppingCart, ArrowLeft, Plus, Minus, Star,
  Truck, RotateCcw, Shield, ChevronRight, ZoomIn
} from 'lucide-react';

// Miniatura de imagen individual
function Thumbnail({ src, alt, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${isActive
          ? 'border-slate-900 shadow-md scale-[1.04]'
          : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
        }`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </button>
  );
}

// Selector de talla individual
function SizeButton({ size, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 min-w-11 px-3 rounded-lg text-sm font-semibold border-2 transition-all duration-200 uppercase tracking-wide ${selected
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.04]'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
        }`}
    >
      {size}
    </button>
  );
}

// Beneficio de compra
function BenefitItem({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [imageZoomed, setImageZoomed] = useState(false);

  const mainImage = selectedImage || product?.image_urls?.[0] || '';
  const avgRating = product ? Number(product.average_rating) : 0;
  const reviewCount = product ? Number(product.review_count) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdRequest(id);
        setProduct(response.data);
      } catch {
        setError('Producto no encontrado o no disponible.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    if (type === 'inc' && quantity < product.stock) setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor selecciona una talla.');
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast.success(`¡${product.name} agregado al carrito!`);
  };

  // ----- Estados de carga / error -----
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-slate-200 w-full" />
              <div className="flex gap-3">
                {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 rounded-xl bg-slate-200" />)}
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-slate-200 rounded-full w-1/3" />
              <div className="h-8 bg-slate-200 rounded-full w-3/4" />
              <div className="h-6 bg-slate-200 rounded-full w-1/4" />
              <div className="h-20 bg-slate-200 rounded-xl w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SEO
          title={product.name}
          description={product.description}
          image={mainImage}
        />
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-slate-400 text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm font-medium text-indigo-600 hover:underline"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Catálogo
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 font-medium truncate max-w-50">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Columna izquierda: Galería ── */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm cursor-zoom-in group"
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <img
                src={mainImage || 'https://placehold.co/800x800/e2e8f0/475569?text=Sin+Imagen'}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${imageZoomed ? 'scale-125' : 'scale-100 group-hover:scale-105'
                  }`}
              />
              {/* Hint zoom */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                <ZoomIn className="h-4 w-4 text-slate-600" />
              </div>

              {/* Badge estado */}
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <span className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full">
                    Agotado
                  </span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.image_urls?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {product.image_urls.map((img, index) => (
                  <Thumbnail
                    key={index}
                    src={img}
                    alt={`Vista ${index + 1}`}
                    isActive={mainImage === img}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Columna derecha: Detalle ── */}
          <div className="flex flex-col">

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(avgRating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({reviewCount} reseñas)</span>
              </div>
            )}

            {/* Nombre y precio */}
            <h1
              className="text-3xl xl:text-4xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ${parseFloat(product.price).toLocaleString('es-CO')}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                  ¡Solo quedan {product.stock}!
                </span>
              )}
            </div>

            {/* Descripción */}
            <p className="mt-5 text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="h-px bg-slate-100 my-6" />

            {/* Selector de Talla */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Talla</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <SizeButton
                    key={size}
                    size={size}
                    selected={selectedSize === size}
                    onClick={() => { setSelectedSize(size); setFeedback({ type: '', message: '' }); }}
                  />
                ))}
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Cantidad</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => handleQuantity('dec')}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity('inc')}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-400">
                  {product.stock > 0
                    ? `${product.stock} disponibles`
                    : 'Sin stock'}
                </span>
              </div>
            </div>

            {/* Feedback inline */}
            {feedback.message && (
              <div className={`mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                {feedback.type === 'success' ? '✓' : '⚠'} {feedback.message}
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
                  ${product.stock === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-indigo-600 text-white hover:shadow-indigo-500/30 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>

            <div className="h-px bg-slate-100 my-6" />

            {/* Beneficios */}
            <div className="space-y-4">
              <BenefitItem
                icon={Truck}
                title="Envío gratuito"
                subtitle="En pedidos mayores a $100.000"
              />
              <BenefitItem
                icon={RotateCcw}
                title="Devoluciones fáciles"
                subtitle="Hasta 30 días después de la compra"
              />
              <BenefitItem
                icon={Shield}
                title="Pago 100% seguro"
                subtitle="Encriptación de nivel bancario"
              />
            </div>
          </div>
        </div>

        {/* Sección de reseñas */}
        <div className="mt-20">
          <div className="mb-8">
            {reviewCount > 0 && (
              <p className="text-slate-500 text-sm mt-1">
                {reviewCount} {reviewCount === 1 ? 'reseña verificada' : 'reseñas verificadas'}
              </p>
            )}
          </div>
          <ProductReviews productId={product.id} />
        </div>
      </main>
    </div>
  );
}