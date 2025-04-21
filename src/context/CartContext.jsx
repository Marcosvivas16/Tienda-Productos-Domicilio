import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      const savedCart = localStorage.getItem(`cart-${userId}`);
      
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Error parsing cart data", e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    
    setLoading(false);
  }, [currentUser]);

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (currentUser && !loading) {
      const userId = currentUser.id;
      localStorage.setItem(`cart-${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, loading]);

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Verificar si el producto ya está en el carrito
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Actualizar cantidad si ya existe
        return prevItems.map(item => 
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Añadir nuevo item si no existe
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Calcular total del carrito
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};