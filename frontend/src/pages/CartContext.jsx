import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
};

const normalizeItems = (rowItems = []) => {
  return rowItems
    .map((item) => {
      const id = item._id || item.productId || item.product?._id;
      const productId = item.productId || item.product?._id || item.product_id;
      const name = item.product?.name ?? item.name ?? "Unnamed Product";
      const price = item.product?.price ?? item.price ?? 0;
      const imageUrl = item.product?.imageUrl ?? item.imageUrl ?? "";

      return {
        ...item,
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity: item.quantity ?? 1,
      };
    })
    .filter((item) => item.id != null);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Fetch cart (from backend if logged in, else from localStorage)
  const fetchCart = async () => {
    const authHeader = getAuthHeader();

    if (!authHeader) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart(guestCart);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(
        "https://zippy-cart-backend.onrender.com/api/cart",
        {
          ...authHeader,
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
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) return;

    try {
      const { data } = await axios.get(
        "https://zippy-cart-backend.onrender.com/api/cart",
        authHeader
      );

      const rowItems = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
        ? data.items
        : data.cart?.items || [];

      setCart(normalizeItems(rowItems));
    } catch (error) {
      console.error("Error refreshing cart", error);
    }
  };

  // ✅ Add item to cart
  const addToCart = async (productId, quantity = 1, productData = {}) => {
    const authHeader = getAuthHeader();

    // 🟢 If not logged in → store in localStorage
    if (!authHeader) {
      const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingItemIndex = localCart.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0) {
        localCart[existingItemIndex].quantity += quantity;
      } else {
        localCart.push({
          id: productId,
          productId,
          name: productData.name || "Unnamed Product",
          price: productData.price || 0,
          imageUrl: productData.imageUrl || "",
          quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(localCart));
      setCart(localCart);
      return;
    }

    // 🟢 If logged in → send to backend
    try {
      await axios.post(
        "https://zippy-cart-backend.onrender.com/api/cart",
        { productId, quantity },
        authHeader
      );
      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (lineId, quantity) => {
    const authHeader = getAuthHeader();
    if (!authHeader) return; // Only logged-in user can update cart from backend

    try {
      await axios.put(
        `https://zippy-cart-backend.onrender.com/api/cart/${lineId}`,
        { quantity },
        authHeader
      );
      await refreshCart();
    } catch (error) {
      console.error("Error updating cart quantity", error);
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (lineId) => {
    const authHeader = getAuthHeader();

    // Guest cart removal
    if (!authHeader) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item.productId !== lineId);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return;
    }

    try {
      await axios.delete(
        `https://zippy-cart-backend.onrender.com/api/cart/${lineId}`,
        authHeader
      );
      await refreshCart();
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    const authHeader = getAuthHeader();

    if (!authHeader) {
      localStorage.removeItem("guestCart");
      setCart([]);
      return;
    }

    try {
      await axios.post(
        "https://zippy-cart-backend.onrender.com/api/cart/clear",
        {},
        authHeader
      );
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart", error);
    }
  };

  // ✅ Cart totals
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

// ✅ Custom hook
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
