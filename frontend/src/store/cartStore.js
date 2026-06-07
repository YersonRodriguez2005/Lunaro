import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Agregar al carrito con verificación de talla
      addToCart: (product, quantity, size) => {
        const { cartItems } = get();
        // Verificar si ya existe el mismo producto con la MISMA talla
        const existingItemIndex = cartItems.findIndex(
          (item) => item.productId === product.id && item.size === size
        );

        if (existingItemIndex !== -1) {
          // Si existe, actualizamos la cantidad
          const updatedCart = [...cartItems];
          updatedCart[existingItemIndex].quantity += quantity;
          set({ cartItems: updatedCart });
        } else {
          // Si no existe, lo agregamos como nuevo ítem
          set({
            cartItems: [
              ...cartItems,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_urls ? product.image_urls[0] : product.image_url,
                quantity: quantity,
                size: size,
                maxStock: product.stock 
              }
            ]
          });
        }
      },

      // Eliminar ítem específico (identificado por ID y Talla)
      removeFromCart: (productId, size) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
        }));
      },

      // Actualizar cantidad desde el carrito
      updateQuantity: (productId, size, newQuantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => 
            item.productId === productId && item.size === size
              ? { ...item, quantity: newQuantity }
              : item
          )
        }));
      },

      // Vaciar el carrito tras el checkout exitoso
      clearCart: () => set({ cartItems: [] }),
      
      // Función extra para calcular el total de ítems en el Header
      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    { name: 'lunaro-cart' }
  )
);