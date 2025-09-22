import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const normalizeItems = (rowItems = []) => {
  return rowItems
    .map((item) => {
      const id = item._id || item.productId || item.product?._id;
      const productId = item.productId || item.product?._id || item.product_id;
      const name = item.product?.name || item.name || "Unnamed";
      const price = item.price ?? item.product?.price ?? 0;
      const imageUrl = item.product?.imageUrl || item.imageUrl || "";

      return {
        ...item,
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity: item.quantity || 0,
      };
    })
    .filter((item) => item.id != null);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fatchCart();
  }, []);

  const fatchCart = async () => {
    try {
      const { data } = await axios.get("https://zippy-cart-backend.onrender.com/api/cart", {
        ...getAuthHeader(),
        withCredentials: true,
      });

      const rowItems = Array.isArray(data)
        ? data
        : Array.isArray(data.item)
        ? data.items // here plz be carefull
        : data.cart?.items || [];
      setCart(normalizeItems(rowItems));
    } catch (error) {
      console.error("Error in fatching cart", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    try {
      const { data } = await axios.get(
        "https://zippy-cart-backend.onrender.com/api/cart",
        getAuthHeader()
      );

      const rowItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : data.cart?.items || [];

      setCart(normalizeItems(rowItems));
    } catch (error) {
      console.error("error in refrshing cart", error);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      // console.log("this is from CartContext.jsx file:", {
      //   productId: productId,
      //   quantity: 1,
      // });
      await axios.post(
        "https://zippy-cart-backend.onrender.com/api/cart",
        { productId, quantity },
        getAuthHeader()
      );
      await refreshCart();
    } catch (error) {
      console.error("Error in add to cart", error);
    }
  };
  
  // Update quantity
  const updateQuantity = async (lineId, quantity) => {
    try {
      await axios.put(
        `https://zippy-cart-backend.onrender.com/api/cart/${lineId}`,
        { quantity },
        getAuthHeader()
      );
      await refreshCart();
    } catch (error) {
      console.error("error in updating the cart", error);
    }
  };

  const removeFromCart = async (lineId) => {
    try {
      await axios.delete(
        `https://zippy-cart-backend.onrender.com/api/cart/${lineId}`,
        getAuthHeader()
      );
      await refreshCart();
    } catch (error) {}
  };

  const clearCart = async () => {
    try {
      await axios.post(
        "https://zippy-cart-backend.onrender.com/api/cart/clear",
        {},
        getAuthHeader()
      );
      setCart([]);
    } catch (error) {
      console.error("clearing cart error", error);
    }
  };

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
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
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside cartProvider");
  return ctx;
};
