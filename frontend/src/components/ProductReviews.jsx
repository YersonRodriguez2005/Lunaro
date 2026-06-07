import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Loader2 } from 'lucide-react';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

// Genera un color de avatar determinista a partir del nombre
function avatarColor(name = '') {
  const colors = [
    'bg-violet-500', 'bg-indigo-500', 'bg-blue-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-orange-500'
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function ReviewAvatar({ name }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  return (
    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${avatarColor(name)}`}>
      {initials}
    </div>
  );
}

function StarRating({ rating, interactive = false, hovered = 0, onHover, onSelect, size = 'md' }) {
  const h = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = interactive ? star <= (hovered || rating) : star <= rating;
        return (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onSelect?.(star)}
            onMouseEnter={() => interactive && onHover?.(star)}
            onMouseLeave={() => interactive && onHover?.(0)}
            className={interactive ? 'focus:outline-none transition-transform hover:scale-110' : 'cursor-default'}
            aria-label={interactive ? `${star} estrella${star > 1 ? 's' : ''}` : undefined}
          >
            <Star
              className={`${h} transition-colors duration-100 ${
                filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({ rev }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group py-5 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <ReviewAvatar name={rev.user_name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className="text-sm font-semibold text-slate-900">{rev.user_name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={rev.rating} size="sm" />
                <span className="text-xs text-slate-400">
                  {new Date(rev.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
          <button
            onClick={() => setLiked(l => !l)}
            className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium transition-colors ${
              liked ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Útil
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/products/${productId}/reviews`);
        setReviews(res.data);
      } catch {
        console.error('Error al cargar reseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await axios.post(`/products/${productId}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setFeedback({ type: 'success', text: '¡Gracias por compartir tu opinión!' });
      
      // Refresh reviews after submission
      const res = await axios.get(`/products/${productId}/reviews`);
      setReviews(res.data);
      setLoading(false);

      setTimeout(() => setFeedback(null), 4000);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Error al enviar la reseña.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Distribución de estrellas para el resumen
  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const starDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ── Resumen de calificaciones ── */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Valoraciones
          </h3>

          {reviews.length > 0 ? (
            <>
              {/* Promedio grande */}
              <div className="text-center mb-5">
                <p className="text-5xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
                <StarRating rating={Math.round(avgRating)} />
                <p className="text-xs text-slate-400 mt-1.5">{reviews.length} reseñas</p>
              </div>

              {/* Barras por estrella */}
              <div className="space-y-2">
                {starDistribution.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2.5 text-xs">
                    <span className="text-slate-500 w-4 text-right shrink-0">{star}</span>
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 w-4 shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-slate-200 mb-2">—</div>
              <p className="text-sm text-slate-400">Sin reseñas aún</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews + formulario ── */}
      <div className="lg:col-span-2 space-y-6">

        {/* Formulario */}
        {isAuthenticated ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Deja tu reseña</h4>

            {feedback && (
              <div className={`mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {feedback.type === 'success' ? '✓' : '⚠'} {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de estrellas interactivo */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Tu calificación
                </p>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={rating}
                    interactive
                    hovered={hoveredRating}
                    onHover={setHoveredRating}
                    onSelect={setRating}
                  />
                  <span className="text-xs text-slate-400 font-medium">
                    {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][hoveredRating || rating]}
                  </span>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Comentario
                </p>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="¿Cómo fue tu experiencia con este producto?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                ) : 'Publicar reseña'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">¿Tienes este producto?</p>
              <p className="text-xs text-slate-500 mt-0.5">
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                  Inicia sesión
                </Link>{' '}
                para compartir tu opinión.
              </p>
            </div>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-14 text-center">
              <div className="flex justify-center mb-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="h-5 w-5 text-slate-200 fill-slate-200" />
                ))}
              </div>
              <p className="text-slate-400 text-sm font-medium">Sé el primero en reseñar este producto</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 px-6">
              {reviews.map(rev => (
                <ReviewCard key={rev.id} rev={rev} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}