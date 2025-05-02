import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getCart, syncFullCart, removeCartItem } from "../services/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  
  // Referencia para controlar si estamos cargando el carrito inicialmente
  const initialLoadRef = useRef(true);
  // Referencia para saber cuándo se modifica manualmente el carrito
  const manualUpdateRef = useRef(false);

  // Cargar carrito del servidor solo para usuarios autenticados
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!currentUser || !currentUser.id || !isAuthenticated()) {
          setCartItems([]); // Carrito vacío para usuarios no autenticados
          setLoading(false);
          return;
        }
        
        setLoading(true);
        initialLoadRef.current = true; // Marcamos que estamos en carga inicial
        
        console.log(`Cargando carrito del servidor para usuario: ${currentUser.id}`);
        const token = localStorage.getItem('token');
        const serverCart = await getCart(currentUser.id, token);
        
        if (serverCart && serverCart.length > 0) {
          setCartItems(serverCart);
          console.log("Carrito cargado del servidor:", serverCart);
        } else {
          setCartItems([]); // Carrito vacío si no hay items
        }
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
        setCartItems([]); // En caso de error, carrito vacío
      } finally {
        setLoading(false);
        // Después de cargar completamente, desactivamos el flag de carga inicial
        setTimeout(() => {
          initialLoadRef.current = false;
        }, 500); // Pequeño retraso para asegurar que el estado se actualiza completamente
      }
    };
    
    fetchCart();
  }, [currentUser, isAuthenticated]);

  // Guardar cambios en el carrito solo cuando se modifica manualmente
  useEffect(() => {
    const updateCart = async () => {
      // No hacer nada si:
      // 1. Estamos en carga inicial
      // 2. No hay items en el carrito
      // 3. No hay usuario autenticado
      // 4. No se ha realizado una actualización manual
      if (
        initialLoadRef.current || 
        cartItems.length === 0 || 
        !currentUser || 
        !currentUser.id || 
        !isAuthenticated() ||
        !manualUpdateRef.current
      ) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log(`Sincronizando carrito completo para ${currentUser.id}`);
        
        // Sincronizar el carrito completo con el servidor
        await syncFullCart(currentUser.id, token, cartItems);
        
        // Resetear el flag de actualización manual
        manualUpdateRef.current = false;
        
        console.log("Carrito sincronizado correctamente");
      } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
      }
    };
    
    updateCart();
  }, [cartItems, currentUser, isAuthenticated]);

  // Implementación de addToCart
  const addToCart = (product, quantity = 1) => {
    // Solo permitir añadir productos si el usuario está autenticado
    if (!currentUser || !isAuthenticated()) {
      console.log("Solo usuarios autenticados pueden añadir productos al carrito");
      return;
    }
    
    // Marcar que se está realizando una actualización manual
    manualUpdateRef.current = true;
    
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      
      if (exists) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
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

  // Implementación de removeFromCart
  const removeFromCart = (productId) => {
    // Marcar que se está realizando una actualización manual
    manualUpdateRef.current = true;
    
    // Si el usuario está autenticado, eliminar del servidor también
    if (currentUser && currentUser.id && isAuthenticated()) {
      const token = localStorage.getItem('token');
      try {
        removeCartItem(currentUser.id, token, productId)
          .catch(error => console.error("Error al eliminar del servidor:", error));
      } catch (error) {
        console.error("Error al eliminar producto del servidor:", error);
      }
    }
    
    // Eliminar localmente
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Implementación de updateQuantity
  const updateQuantity = (productId, newQuantity) => {
    // Marcar que se está realizando una actualización manual
    manualUpdateRef.current = true;
    
    // Si la cantidad es 0 o negativa, eliminar el producto
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Actualizar la cantidad
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  // Función para calcular el total del carrito
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.precio * item.quantity);
    }, 0);
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    // Marcar que se está realizando una actualización manual
    manualUpdateRef.current = true;
    
    // Si el usuario está autenticado, purgar el carrito en el servidor
    if (currentUser && currentUser.id && isAuthenticated()) {
      const token = localStorage.getItem('token');
      syncFullCart(currentUser.id, token, [])
        .catch(error => console.error("Error al purgar el carrito:", error));
    }
    
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
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