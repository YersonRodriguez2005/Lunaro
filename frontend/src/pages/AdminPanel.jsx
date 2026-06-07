import { useState, useEffect, useCallback } from 'react';
import { getCategoriesRequest, createCategoryRequest } from '../api/categories';
import BackButton from '../components/BackButton';
import { createProductRequest, getProductsRequest, deleteProductRequest, updateProductRequest } from '../api/products';
import {
  PlusCircle, PackagePlus, Edit, Trash2,
  ArchiveRestore, CheckCircle, X, Tag,
  UploadCloud, AlertCircle, Search
} from 'lucide-react';
import { toast } from 'sonner';

// ── Toast de feedback ──────────────────────────────────────────────────────────
function Toast({ feedback, onDismiss }) {
  if (!feedback.message) return null;
  const isSuccess = feedback.type === 'success';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all duration-300 ${isSuccess
      ? 'bg-emerald-600 text-white'
      : 'bg-red-600 text-white'
      }`}>
      {isSuccess
        ? <CheckCircle className="h-4 w-4 shrink-0" />
        : <AlertCircle className="h-4 w-4 shrink-0" />}
      {feedback.message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Input wrapper con label ────────────────────────────────────────────────────
function FormField({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {label}
        </label>
        {hint && <span className="text-xs text-indigo-500 font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const INPUT_CLASS = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all duration-200';

// ── Badge de estado ────────────────────────────────────────────────────────────
function StatusBadge({ active, stock }) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
        <ArchiveRestore className="w-3 h-3" /> Inactivo
      </span>
    );
  }
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
        <X className="w-3 h-3" /> Sin stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
      <CheckCircle className="w-3 h-3" /> Activo
    </span>
  );
}

export default function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all' | 'active' | 'inactive'

  const [productData, setProductData] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', sizes: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const [catsRes, invRes] = await Promise.all([
        getCategoriesRequest(),
        getProductsRequest(true)
      ]);
      setCategories(catsRes.data);
      setInventory(invRes.data);
      if (catsRes.data.length > 0 && !editingId) {
        setProductData(prev => ({ ...prev, category_id: catsRes.data[0].id }));
      }
    } catch {
      showFeedback('error', 'Error al cargar los datos del panel');
    } finally {
      setLoading(false);
    }
  }, [editingId, showFeedback]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchInitialData();
    };
    load();
    return () => { isMounted = false; };
  }, [fetchInitialData]);

  // Filtrado de inventario
  const filteredInventory = (() => {
    let result = inventory;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.sizes?.join('').toLowerCase().includes(q)
      );
    }
    if (filterActive !== 'all') {
      result = result.filter(item => filterActive === 'active' ? item.active : !item.active);
    }
    return result;
  })();

  const handleProductChange = (e) =>
    setProductData({ ...productData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setSelectedFiles(Array.from(e.target.files));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setSelectedFiles(files);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategoryRequest({ name: newCategoryName, description: 'Categoría autogenerada' });
      setNewCategoryName('');
      await fetchInitialData();
      showFeedback('success', `Categoría "${newCategoryName}" creada correctamente`);
    } catch {
      showFeedback('error', 'Error al crear la categoría');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingId && selectedFiles.length === 0) {
      toast.error('Debes seleccionar al menos una imagen.');
      return;
    }
    try {
      const formData = new FormData();
      ['name', 'description', 'price', 'stock', 'category_id', 'sizes'].forEach(key =>
        formData.append(key, productData[key])
      );
      selectedFiles.forEach(file => formData.append('images', file));

      const savePromise = editingId
        ? updateProductRequest(editingId, formData)
        : createProductRequest(formData);

      toast.promise(savePromise, {
        loading: editingId ? 'Actualizando producto...' : 'Creando producto y subiendo imágenes...',
        success: () => {
          setEditingId(null);
          setProductData({ name: '', description: '', price: '', stock: '', category_id: categories[0]?.id || '', sizes: '' });
          setSelectedFiles([]);
          if (document.getElementById('file-upload')) document.getElementById('file-upload').value = '';
          fetchInitialData();
          return editingId ? 'Producto actualizado exitosamente.' : 'Producto registrado exitosamente.';
        },
        error: (err) => err.response?.data?.message || 'Error al guardar el producto',
      });

      if (editingId) {
        await updateProductRequest(editingId, formData);
        showFeedback('success', 'Producto actualizado correctamente');
      } else {
        await createProductRequest(formData);
        showFeedback('success', 'Nuevo producto creado y publicado');
      }

      setEditingId(null);
      setSelectedFiles([]);
      setProductData({ name: '', description: '', price: '', stock: '', category_id: categories[0]?.id, sizes: '' });
      fetchInitialData();
    } catch {
      showFeedback('error', 'Error al guardar el producto');
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      sizes: product.sizes.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedFiles([]);
    setProductData({ name: '', description: '', price: '', stock: '', category_id: categories[0]?.id, sizes: '' });
  };

  const handleDeleteClick = (id) => {
    toast.custom((t) => (
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-4 w-80">
        <h3 className="font-bold text-slate-900 mb-1">¿Desactivar producto?</h3>
        <p className="text-sm text-slate-500 mb-4">Esta acción ocultará el producto del catálogo público.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t); // Cierra el modal
              try {
                await deleteProductRequest(id);
                toast.success('Producto desactivado correctamente');
                fetchInitialData();
                // eslint-disable-next-line no-unused-vars
              } catch (error) {
                toast.error('Error al desactivar el producto');
              }
            }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Sí, desactivar
          </button>
        </div>
      </div>
    ), { duration: Infinity }); // Infinity para que no se cierre solo hasta que el usuario decida
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const activeCount = inventory.filter(i => i.active).length;
  const lowStockCount = inventory.filter(i => i.active && i.stock > 0 && i.stock <= 5).length;
  const outOfStockCount = inventory.filter(i => i.active && i.stock === 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      <Toast feedback={feedback} onDismiss={() => setFeedback({ type: '', message: '' })} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BackButton className="mb-6" />

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
            Lunaro Admin
          </p>
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Panel de Administración
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona tu inventario, categorías y productos del catálogo.
          </p>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total productos', value: inventory.length, color: 'text-slate-900' },
            { label: 'Activos', value: activeCount, color: 'text-emerald-600' },
            { label: 'Stock bajo (≤5)', value: lowStockCount, color: 'text-amber-600' },
            { label: 'Sin stock', value: outOfStockCount, color: 'text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Formularios ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Formulario producto */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${editingId ? 'border-indigo-200' : 'border-slate-100'
            }`}>
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${editingId ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'
              }`}>
              <PackagePlus className={`h-5 w-5 ${editingId ? 'text-indigo-600' : 'text-slate-500'}`} />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {editingId ? 'Editando producto' : 'Nuevo producto'}
              </h2>
              {editingId && (
                <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                  Modo edición
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre del producto">
                  <input name="name" value={productData.name} onChange={handleProductChange} required placeholder="Ej: Camiseta Oversize Premium" className={INPUT_CLASS} />
                </FormField>

                <FormField label="Categoría">
                  <select name="category_id" value={productData.category_id} onChange={handleProductChange} className={INPUT_CLASS}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Precio (COP)">
                  <input name="price" type="number" step="0.01" min="0" value={productData.price} onChange={handleProductChange} required placeholder="0.00" className={INPUT_CLASS} />
                </FormField>

                <FormField label="Stock disponible">
                  <input name="stock" type="number" min="0" value={productData.stock} onChange={handleProductChange} required placeholder="0" className={INPUT_CLASS} />
                </FormField>

                <FormField label="Tallas" hint="Separadas por coma">
                  <input name="sizes" value={productData.sizes} onChange={handleProductChange} required placeholder="S, M, L, XL" className={INPUT_CLASS} />
                </FormField>

                {/* Drop zone imágenes */}
                <FormField
                  label="Imágenes"
                  hint={editingId ? 'Opcional — reemplaza las actuales' : undefined}
                >
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`relative border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-all duration-200 ${dragOver
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <UploadCloud className={`h-6 w-6 mx-auto mb-1 ${dragOver ? 'text-indigo-500' : 'text-slate-400'}`} />
                    {selectedFiles.length > 0 ? (
                      <p className="text-xs font-semibold text-indigo-600">
                        {selectedFiles.length} imagen{selectedFiles.length > 1 ? 'es' : ''} seleccionada{selectedFiles.length > 1 ? 's' : ''}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Arrastra o <span className="text-indigo-500 font-medium">selecciona</span>
                      </p>
                    )}
                  </div>
                </FormField>
              </div>

              <FormField label="Descripción">
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  required
                  rows={3}
                  placeholder="Describe el producto, materiales, estilo..."
                  className={INPUT_CLASS}
                />
              </FormField>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 hover:shadow-md"
                >
                  {editingId ? <><Edit className="h-4 w-4" /> Actualizar producto</> : <><PlusCircle className="h-4 w-4" /> Crear producto</>}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Panel lateral — categorías + stats */}
          <div className="space-y-5">
            {/* Crear categoría */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Categorías
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nueva categoría..."
                    className={INPUT_CLASS}
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all duration-200"
                  >
                    Agregar categoría
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm text-slate-700 font-medium">{cat.name}</span>
                      <span className="text-xs text-slate-400">
                        {inventory.filter(p => p.category_id === cat.id).length} prod.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabla Inventario ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header tabla */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Inventario
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {filteredInventory.length} de {inventory.length} productos
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
              {/* Búsqueda */}
              <div className="relative flex-1 sm:flex-initial sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>

              {/* Filtro estado */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'active', label: 'Activos' },
                  { value: 'inactive', label: 'Inactivos' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterActive(opt.value)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 ${filterActive === opt.value
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Producto', 'Precio', 'Stock', 'Estado', ''].map(col => (
                    <th
                      key={col}
                      className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No se encontraron productos con ese criterio.
                    </td>
                  </tr>
                ) : filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${!item.active ? 'opacity-50' : ''}`}
                  >
                    {/* Producto */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img
                            src={item.image_urls?.[0] || 'https://placehold.co/44x44/e2e8f0/475569?text=IMG'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate max-w-45">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.sizes?.join(' · ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Precio */}
                    <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      ${parseFloat(item.price).toLocaleString('es-CO')}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${item.stock === 0
                        ? 'bg-red-50 text-red-600'
                        : item.stock <= 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                        }`}>
                        {item.stock} uds.
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-3.5">
                      <StatusBadge active={item.active} stock={item.stock} />
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-150"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {item.active && (
                          <button
                            onClick={() => handleDeleteClick(item.id, item.name)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
                            title="Desactivar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}