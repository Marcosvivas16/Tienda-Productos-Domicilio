import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { getCart, saveCart } from "../services/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde la API al iniciar sesión
  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return; 

      try {
        const token = localStorage.getItem('token'); 
        const data = await getCart(currentUser.id, token); 
        setCartItems(data);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [currentUser]);

  // Guardar el carrito en la API cada vez que cambie
  useEffect(() => {
    const updateCart = async () => {
      // Verificar si hay usuario y si tiene un ID válido
      if (currentUser && (currentUser.id)) {
        try {
          const userId = currentUser.id;
          console.log("Guardando carrito para usuario:", userId);
          await saveCart(userId, localStorage.getItem('token'), cartItems);
        } catch (error) {
          console.error("Error al guardar el carrito:", error);
        }
      } else if (currentUser) {
        console.warn("No se puede guardar el carrito: ID de usuario no encontrado", currentUser);
      }
    };
    
    if (cartItems.length > 0) {
      updateCart();
    }
  }, [cartItems, currentUser]);

  // Funciones de gestión del carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev =>
      prev.some(item => item.id === product.id)
        ? prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...prev, { ...product, quantity }]
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};