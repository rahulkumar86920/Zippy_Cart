import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((ci) => ci.id === item.id);
      if (existingItem) {
        return prevCart.map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  // Remove item
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.id !== itemId));
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((ci) =>
        ci.id === itemId ? { ...ci, quantity: newQuantity } : ci
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total cost
  const getCartTotal = () =>
    cart.reduce((total, ci) => total + ci.price * ci.quantity, 0);

  // Total item count
  const cartCount = cart.reduce((count, ci) => count + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
//new