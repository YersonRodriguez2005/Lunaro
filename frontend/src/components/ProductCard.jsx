import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const avgRating = Number(product.average_rating);
  const reviewCount = Number(product.review_count);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const imageUrl = product.image_urls?.[0] || 'https://placehold.co/800x800/e2e8f0/475569?text=Sin+Imagen';
  const secondImageUrl = product.image_urls?.[1];

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative flex flex-col">

        {/* Imagen */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-slate-100">

          {/* Imagen principal */}
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-in-out
              ${secondImageUrl ? 'group-hover:opacity-0' : 'group-hover:scale-105'}
              ${isOutOfStock ? 'grayscale' : ''}`}
          />

          {/* Segunda imagen (hover swap) */}
          {secondImageUrl && (
            <img
              src={secondImageUrl}
              alt={`${product.name} — vista alternativa`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            />
          )}

          {/* Overlay acción — aparece al hover */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />

          {/* Botón "Ver producto" flotante */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <div className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold py-2.5 rounded-xl shadow-lg">
              <ShoppingBag className="h-3.5 w-3.5" />
              Ver producto
            </div>
          </div>

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {/* Badge stock bajo / agotado */}
            {isOutOfStock && (
              <span className="bg-slate-800/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                Agotado
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                Últimas {product.stock} uds.
              </span>
            )}
            {!isOutOfStock && !isLowStock && <span />}

            {/* Badge rating */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-800">{avgRating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="mt-3 px-0.5">
          {/* Categoría/tallas como meta-info */}
          <div className="flex items-center gap-1.5 mb-1">
            {product.sizes?.slice(0, 4).map(size => (
              <span
                key={size}
                className="text-[10px] font-medium text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase"
              >
                {size}
              </span>
            ))}
            {product.sizes?.length > 4 && (
              <span className="text-[10px] text-slate-400">+{product.sizes.length - 4}</span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors duration-200">
            {product.name}
          </h3>

          <div className="mt-1 flex items-center justify-between">
            <p className={`text-base font-bold ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
              ${parseFloat(product.price).toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}