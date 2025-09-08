import React from "react";
import { useCart } from "../pages/CartContext";
import { cartStyles } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCross } from "react-icons/fa";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
        useCart();

    const handleQuantityChange = (itemId, change) => {
        const item = cart.find((i) => i.id === itemId);
        if (!item) return;
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            updateQuantity(itemId, newQuantity);
        } else {
            removeFromCart(itemId);
        }
    };

    // if the cart is empty then this code will execute
    if (cart.length === 0) {
        return (
            <div className={cartStyles.pageContainer}>
                <div className={cartStyles.maxContainer}>
                    <Link to="/items" className={cartStyles.continueShopping}>
                        <FaArrowLeft className="mr-2" />
                        Continue Shopping
                    </Link>
                    <div className={cartStyles.emptyCartContainer}>
                        <div className={cartStyles.emptyCartIcon}>🛒</div>
                        <h1 className={cartStyles.emptyCartHeading}> Your Cart Is Empty</h1>
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
                            {cart.map((item) => (
                                <div key={item.id} className={cartStyles.cartItemCard}>
                                    <div className={cartStyles.cartItemImageContainer}>
                                        <img src={item.image} alt="item image" className={cartStyles.cartItemImage} />
                                    </div>
                                    <h3 className={cartStyles.cartItemName}>{item.name}</h3>
                                    <p className={cartStyles.cartItemPrice}>
                                        {(item.price ?? 0).toFixed(2)}
                                    </p>

                                    {/* add controls */}
                                    <div className={cartStyles.cartItemQuantityContainer}>
                                        {/* this button is for to decrease the quantity of the product in the cart page */}
                                        <button onClick={() => handleQuantityChange(item.id, -1)}
                                            className={cartStyles.cartItemQuantityButton}>
                                            <FiMinus />
                                        </button>
                                        {/* this is for to show the quantity of the products */}
                                        <span className={cartStyles.cartItemQuantity}>{item.quantity} </span>
                                        {/* this button is for to increase the quantity of the product in the cart page */}
                                        <button onClick={() => handleQuantityChange(item.id, 1)}
                                            className={cartStyles.cartItemQuantityButton}>
                                            <FiPlus />
                                        </button>
                                    </div>
                                    {/* this button is to remove the item from the cart */}
                                    <button onClick={() => removeFromCart(item.id)}
                                        className={cartStyles.cartItemRemoveButton}>
                                        <FiTrash2 className="mr-1" /> Remove
                                    </button>

                                </div>
                            ))

                            }
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
                                    <span className={cartStyles.orderSummaryValue}>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                {/* this is for the shipping fee */}
                                <div className={cartStyles.orderSummaryRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Shipping </span>
                                    <span className={cartStyles.orderSummaryValue}>Free</span>
                                </div>
                                {/* this is for the Goverbment taxes */}
                                <div className={cartStyles.orderSummaryRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Taxes (%5)</span>
                                    <span className={cartStyles.orderSummaryValue}>₹{(getCartTotal() * 0.05).toFixed(2)}</span>
                                </div>

                                <div className={cartStyles.orderSummaryDivider} />
                                {/* this is for the total amount  */}
                                <div className={cartStyles.orderSummaryTotalRow}>
                                    <span className={cartStyles.orderSummaryLabel}>Total</span>
                                    <span className={cartStyles.orderSummaryTotalValue}>₹{(getCartTotal() * 1.05).toFixed(2)}</span>
                                </div>

                                {/* this is for the checkout button */}
                                <button className={cartStyles.checkoutButton}>
                                    Proceed to checkout
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
