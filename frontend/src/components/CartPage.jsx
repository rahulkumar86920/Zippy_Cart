import React from "react";
import { useCart } from "../pages/CartContext";
import { cartStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCross } from "react-icons/fa";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Helpers to pull fields from either item.* or item.product.*
  const getItemPrice = (item) => item.price ?? item.product?.price ?? 0;
  const getItemName = (item) =>
    item.name ?? item.product?.name ?? "Unnamed item";
  const getItemImage = (item) => {
    const path =
      item.image ?? item.product?.image ?? item.product?.imageUrl ?? "";
    return path ? `http://localhost:8080${path}` : "/no-image.png";
  };

  // subTotal
  const subTotal = cart.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const handleQuantityChange = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty > 0) {
      await updateQuantity(id, newQty);
    } else {
      await removeFromCart(id);
    }
  };

  // if the cart is empty then this code will execute
  if (cart.length === 0) {
    return (
      <div className={`${cartStyles.pageContainer} pt-25`}>
        {" "}
        {/* Added padding */}
        <div className={cartStyles.maxContainer}>
          <Link to="/items" className={cartStyles.continueShopping}>
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <div className={cartStyles.emptyCartContainer}>
            <div className={cartStyles.emptyCartIcon}>🛒</div>
            <h1 className={cartStyles.emptyCartHeading}>Your Cart Is Empty</h1>
            <p className={cartStyles.emptyCartText}>
              Looks like you haven't added something in the cart yet :)
            </p>
            <Link to="/items" className={cartStyles.emptyCartButton}>
              Browse Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cartStyles.pageContainer}>
      <div className={cartStyles.maxContainerLarge}>
        <div className={cartStyles.headerContainer}>
          <h1 className={cartStyles.headerTitle}>Your Shopping Cart</h1>
          <button onClick={clearCart} className={cartStyles.clearCartButton}>
            <FiTrash2 className="mr-1" />
            Clear Cart
          </button>
        </div>

        <div className={cartStyles.cartGrid}>
          <div className={cartStyles.cartItemsSection}>
            <div className={cartStyles.cartItemsGrid}>
              {cart.map((item) => {
                const id = item._id; // instead of item.id
                const name = getItemName(item);
                const price = getItemPrice(item);
                const img = getItemImage(item);

                return (
                  <div key={id} className={cartStyles.cartItemCard}>
                    <div className={cartStyles.cartItemImageContainer}>
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className={cartStyles.cartItemImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 rounded-md">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className={cartStyles.cartItemName}>{name}</h3>
                    <p className={cartStyles.cartItemPrice}>
                      ₹{price.toFixed(2)}
                    </p>

                    <div className={cartStyles.cartItemQuantityContainer}>
                      <button
                        className={cartStyles.cartItemQuantityButton}
                        onClick={() => handleQuantityChange(id, -1)}
                      >
                        <FiMinus />
                      </button>
                      <span className={cartStyles.cartItemQuantity}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(id, 1)}
                        className={cartStyles.cartItemQuantityButton}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(id)}
                      className={cartStyles.cartItemRemoveButton}
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={cartStyles.orderSummaryCard}>
              <h2 className={cartStyles.orderSummaryTitle}> Order Summary</h2>

              <div className="space-y-4 text-sm sm:text-base">
                {/* this is for the product amount  */}
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>Subtotal</span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{subTotal.toFixed(2)}
                  </span>
                </div>
                {/* this is for the shipping fee */}
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>
                    Delivery charge{" "}
                  </span>
                  <span className={cartStyles.orderSummaryValue}>Free</span>
                </div>
                {/* this is for the Goverbment taxes */}
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>
                    Taxes (%5)
                  </span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{(subTotal * 0.05).toFixed(2)}
                  </span>
                </div>

                <div className={cartStyles.orderSummaryDivider} />
                {/* this is for the total amount  */}
                <div className={cartStyles.orderSummaryTotalRow}>
                  <span className={cartStyles.orderSummaryLabel}>Total</span>
                  <span className={cartStyles.orderSummaryTotalValue}>
                    ₹{(subTotal * 1.05).toFixed(2)}
                  </span>
                </div>

                {/* this is for the checkout button */}
                <button className={cartStyles.checkoutButton}>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </button>

                <div className={cartStyles.continueShoppingBottom}>
                  <Link to="/items" className={cartStyles.continueShopping}>
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
