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
      const name = item.product?.name || item.name || "Unnamed Product";
      const price = item.price ?? item.product?.price ?? 0;
      const imageUrl = item.product?.imageUrl || item.imageUrl || item.image || "";

      return {
        ...item,
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity: item.quantity || 1,
      };
    })
    .filter((item) => item.id != null);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = () => {
    return (
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = isLoggedIn();

      if (!token) {
        // Guest cart
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCart(guestCart);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        "https://zippy-cart-backend.onrender.com/api/cart",
        {
          ...getAuthHeader(),
          withCredentials: true,
        }
      );

      const rowItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : data.cart?.items || [];

      setCart(normalizeItems(rowItems));
    } catch (error) {
      console.error("Error in fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    const token = isLoggedIn();
    if (!token) return;

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
      console.error("error in refreshing cart", error);
    }
  };

  // ✅ Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const token = isLoggedIn();

    if (!token) {
      // Guest cart
      const existing = cart.find((i) => i.id === product._id);
      let updatedCart;

      if (existing) {
        updatedCart = cart.map((i) =>
          i.id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updatedCart = [
          ...cart,
          {
            id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.image || product.imageUrl || "",
            quantity,
          },
        ];
      }

      setCart(updatedCart);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      return;
    }

    try {
      await axios.post(
        "https://zippy-cart-backend.onrender.com/api/cart",
        { productId: product._id, quantity },
        getAuthHeader()
      );
      await refreshCart();
    } catch (error) {
      console.error("Error in add to cart", error);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (lineId, quantity) => {
    const token = isLoggedIn();

    if (!token) {
      const updated = cart.map((item) =>
        item.id === lineId ? { ...item, quantity } : item
      );
      setCart(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return;
    }

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
    const token = isLoggedIn();

    if (!token) {
      const updated = cart.filter((item) => item.id !== lineId);
      setCart(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return;
    }

    try {
      await axios.delete(
        `https://zippy-cart-backend.onrender.com/api/cart/${lineId}`,
        getAuthHeader()
      );
      await refreshCart();
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  const clearCart = async () => {
    const token = isLoggedIn();

    if (!token) {
      setCart([]);
      localStorage.removeItem("guestCart");
      return;
    }

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
