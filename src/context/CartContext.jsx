/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getCart, saveCart, removeCartItem } from "../services/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  
  const manualUpdateRef = useRef(null);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    const loadCartFromServer = async () => {
      if (!currentUser || !currentUser.id || !isAuthenticated()) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Cargando carrito del servidor para usuario: ${currentUser.id}`);
        
        const token = localStorage.getItem('token');
        const serverCart = await getCart(currentUser.id, token);
        
        if (serverCart && Array.isArray(serverCart)) {
          setCartItems(serverCart);
          console.log("Carrito cargado del servidor:", serverCart);
        } else {
          setCartItems([]);
          console.log("No se encontró carrito en el servidor, inicializado vacío");
        }
      } catch (error) {
        console.error("Error al cargar el carrito del servidor:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromServer();
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    if (!currentUser?.id || !isAuthenticated() || !manualUpdateRef.current) {
      return;
    }
    
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Debounce para la sincronización
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        // Obtener el producto que cambió
        const productToSync = manualUpdateRef.current;
        console.log(`Sincronizando producto: ${productToSync.id} para usuario ${currentUser.id}`);
        
        const token = localStorage.getItem('token');
        
        // Sincronizar SOLO el producto que cambió
        await saveCart(currentUser.id, token, {
          productoId: productToSync.id,
          cantidad: productToSync.quantity || 1
        });
        
        console.log("Producto sincronizado correctamente");
      } catch (error) {
        console.error("Error al sincronizar producto:", error);
      } finally {
        manualUpdateRef.current = null; 
      }
    }, 500);
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [manualUpdateRef.current, currentUser, isAuthenticated]);

  const addToCart = (product, quantity = 1) => {
    if (!currentUser || !isAuthenticated()) {
      console.log("Solo usuarios autenticados pueden añadir productos al carrito");
      return;
    }
    
    if (!product || !product.id) {
      console.error("Error: Intentando añadir producto sin ID");
      return;
    }
    
    manualUpdateRef.current = {
      id: product.id,
      quantity: quantity
    };
    
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      
      if (exists) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: quantity } 
            : item
        );
      } else {
        return [...prevItems, { 
          ...product, 
          quantity: quantity 
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error("Error: ID de producto no válido para eliminar");
      return;
    }
    
    if (currentUser && currentUser.id && isAuthenticated()) {
      const token = localStorage.getItem('token');
      try {
        removeCartItem(currentUser.id, token, productId)
          .catch(error => console.error("Error al eliminar del servidor:", error));
      } catch (error) {
        console.error("Error al eliminar producto del servidor:", error);
      }
    }
        
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!productId || typeof newQuantity !== 'number') {
      console.error("Error: Parámetros inválidos para actualizar cantidad");
      return;
    }
    
    // Si la cantidad es 0 o negativa, eliminar el producto
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Guardar el producto que se va a sincronizar
    manualUpdateRef.current = {
      id: productId,
      quantity: newQuantity
    };
    
    // Actualizar la cantidad
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Calcular total del carrito - SIN CAMBIOS
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = parseFloat(item.precio) || 0;
      return total + (precio * (item.quantity || 1));
    }, 0);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    console.log("Carrito limpiado localmente");
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};