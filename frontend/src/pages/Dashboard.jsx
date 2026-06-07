import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getProductsRequest } from '../api/products';
import { getCategoriesRequest } from '../api/categories';
import { useSearchStore } from '../store/searchStore';
import SEO from '../components/SEO';
import { ChevronLeft, ChevronRight, Grid3X3, Star, SlidersHorizontal, X } from 'lucide-react';

// Skeleton de tarjeta de producto para estado de carga
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-200 rounded-2xl aspect-3/4 mb-3" />
      <div className="space-y-2 px-1">
        <div className="h-3 bg-slate-200 rounded-full w-3/4" />
        <div className="h-3 bg-slate-200 rounded-full w-1/2" />
        <div className="h-4 bg-slate-200 rounded-full w-1/3 mt-1" />
      </div>
    </div>
  );
}

// Botón de categoría individual
function CategoryPill({ label, active, onClick, icon, accentColor = 'indigo' }) {
  const baseStyles = 'flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border';
  const activeStyles = accentColor === 'amber'
    ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-[1.02]'
    : 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]';
  const inactiveStyles = accentColor === 'amber'
    ? 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300';

  return (
    <button onClick={onClick} className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}>
      {icon}
      {label}
    </button>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchStore(state => state.searchQuery);

  const itemsPerPage = 8;

  // Lógica de filtrado
  let filteredProducts = products;

  if (selectedCategory === 'top-rated') {
    filteredProducts = [...products]
      .filter(product => Number(product.average_rating) >= 4)
      .sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
  } else if (selectedCategory !== null) {
    filteredProducts = products.filter(product => product.category_id === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const lowerCaseQuery = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery)
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProductsRequest(),
          getCategoriesRequest()
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error cargando el dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeCategory = selectedCategory === 'top-rated'
    ? 'Mejor Valorados'
    : selectedCategory
      ? categories.find(c => c.id === selectedCategory)?.name
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Barra de filtros */}
        {!loading && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Filtrar por
                </h2>
                {activeCategory && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                    {activeCategory}
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className="ml-0.5 text-indigo-400 hover:text-indigo-700 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <CategoryPill
                label="Todos"
                active={selectedCategory === null}
                onClick={() => handleCategoryChange(null)}
                icon={<Grid3X3 className="h-3.5 w-3.5" />}
              />

              <CategoryPill
                label="Mejor Valorados"
                active={selectedCategory === 'top-rated'}
                onClick={() => handleCategoryChange('top-rated')}
                icon={
                  <Star
                    className={`h-3.5 w-3.5 ${
                      selectedCategory === 'top-rated' ? 'fill-current' : 'text-amber-500'
                    }`}
                  />
                }
                accentColor="amber"
              />

              {categories.map(category => (
                <CategoryPill
                  key={category.id}
                  label={category.name}
                  active={selectedCategory === category.id}
                  onClick={() => handleCategoryChange(category.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid de productos */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <SlidersHorizontal className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              No encontramos prendas
            </h3>
            <p className="text-slate-500 mt-1.5 text-sm max-w-xs mx-auto">
              {searchQuery
                ? `No hay resultados para "${searchQuery}". Intenta con otra búsqueda.`
                : 'Prueba seleccionando otra categoría.'}
            </p>
            <button
              onClick={() => handleCategoryChange(null)}
              className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={`w-9 h-9 text-sm font-medium rounded-full transition-all duration-200 ${
                            currentPage === item
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}