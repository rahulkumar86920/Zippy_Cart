import React, { useState } from "react";
import { checkoutStyles } from "../assets/dummyStyles";
import { useCart } from "../pages/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiPackage,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import axios from "axios";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const order = {
      customer: { ...formData },
      // items: cart.map((item) => ({
      //   id: item.productId || item.id,
      //   name: item.name,
      //   price: item.price,
      //   quantity: item.quantity,
      //   imageUrl: item.image || item.imageUrl,
      // })),
      items: cart.map((item) => ({
  id: item.productId || item.id,
  name: item.product?.name || item.name, // ✅ Get from product
  price: item.product?.price || item.price, // ✅ Get from product  
  quantity: item.quantity,
  imageUrl: item.product?.imageUrl || item.product?.image || item.image || item.imageUrl, // ✅ Get from product
})),
      total: getCartTotal(),
      status: "Pending",
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === "COD" ? "Paid" : "Unpaid",
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: formData.notes,
    };

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post("https://zippy-cart-backend.onrender.com/api/orders", order, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
        return;
      }

      if (res.status === 201 || res.status === 200) {
        const createOrder = res.data.order;
        const displayId = createOrder.orderId || createOrder._id;

        clearCart();
        alert(`Order Placed Successfully! Order ID ${displayId}`);
        navigate("/");
      } else {
        alert("Order failed. Try again");
      }
    } catch (error) {
      console.error(error);
      alert("failed to placed order. Please Try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal();
  const tax = total * 0.05;
  const grandTotal = total + tax;

  // console.log("cart", cart);

  return (
    <div className={checkoutStyles.page}>
      <div className={checkoutStyles.container}>
        <Link to="/cart" className={checkoutStyles.backLink}>
          <FiArrowLeft className="mr-2" />
        </Link>
        <div className={checkoutStyles.header}>
          <h1 className={checkoutStyles.mainTitle}>Checkout</h1>
          <p className={checkoutStyles.subtitle}>
            Complete you purchase with secure checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* customer information */}
          <div className={checkoutStyles.card}>
            <h2 className={checkoutStyles.sectionTitle}>
              <FiUser className="mr-2 text-emerald-300" />
              Customer Information
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* name */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mr-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${checkoutStyles.input} ${
                    errors.name ? checkoutStyles.inputError : ""
                  }`}
                  placeholder="Rahul Sah"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* email addred */}
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mr-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${checkoutStyles.input} ${
                      errors.email ? checkoutStyles.inputError : ""
                    }`}
                    placeholder="rahulkumar86920@gmail.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* phone number */}
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mr-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${checkoutStyles.input} ${
                      errors.phone ? checkoutStyles.inputError : ""
                    }`}
                    placeholder="8291651145"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>
              </div>
              {/* address  */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mr-2">
                  Delivery Address *
                </label>
                <textarea
                  role="3"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${checkoutStyles.input} ${
                    errors.address ? checkoutStyles.inputError : ""
                  }`}
                  placeholder="Juhu Koliwada Santacruz West Mumbai 400049"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-400">{errors.address}</p>
                )}
              </div>
              {/* delivery notes */}
              <div>
                <label className="block text-sm font-medium text-emerald-300 mr-2">
                  Delivery Notes *
                </label>
                <textarea
                  role="2"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={checkoutStyles.input}
                  placeholder="Please Call Me Once You Reach At Location :)"
                />
              </div>
              {/* payment method */}

              <div>
                <h3 className={checkoutStyles.sectionTitle}>
                  <FiCreditCard className="mr-2 text-emerald-300" />
                  Payment Method
                </h3>
                {/* COD Payment */}
                <label className={checkoutStyles.radioCard}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="ml-3">
                    <span className=" font-medium text-emerald-100">
                      Cash On Delivery
                    </span>
                    <span className="block text-sm text-emerald-400">
                      Pay On Delivery
                    </span>
                  </div>
                </label>
                {/* online payment */}
                <label className={checkoutStyles.radioCard}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="ml-3">
                    <span className=" font-medium text-emerald-100">
                      Online Payment
                    </span>
                    <span className="block text-sm text-emerald-400">
                      Pay Now Via Card/UPi
                    </span>
                  </div>
                </label>
              </div>
            </form>
          </div>

          {/* order Summary */}
          <div className={checkoutStyles.card}>
            <h2 className={checkoutStyles.sectionTitle}>
              <FiPackage className="mr-2 text-emerald-300" />
              Order Summary
            </h2>
            <div className="mb-6">
              <h3 className="text-emerald-300 mb-4 font-medium">
                Your Items ({cart.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => {
                  const product = item.product;

                  // pick the image (works for both single & array fields)
                  const rawImage =
                    product?.imageUrl ||
                    product?.image ||
                    (Array.isArray(product?.images) ? product.images[0] : null);

                  const imageSrc = rawImage
                    ? rawImage.startsWith("http")
                      ? rawImage
                      : `https://zippy-cart-backend.onrender.com${rawImage}`
                    : null;

                  return (
                    <div
                      key={item.id || item._id}
                      className={checkoutStyles.cartItem}
                    >
                      <div className={checkoutStyles.cartImage}>
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product?.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/no-image.png";
                            }}
                          />
                        ) : (
                          <FiPackage className="text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-emerald-100">
                          {product?.name}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-emerald-400">
                            ₹{product?.price?.toFixed(2)} × {item.quantity}
                          </span>
                          <span className="font-medium text-emerald-100">
                            ₹{(product?.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-emerald-700/50 pt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-emerald-300">Subtotal</span>
                <span className="font-medium text-emerald-100">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-emerald-300">Delivery</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>

              <div className="flex justify-between">
                <span className="text-emerald-300">Taxes (%5)</span>
                <span className="text-emerald-100 font-medium">
                  {" "}
                  ₹{tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pt-3 mt-3 border-t border-emerald-700/50">
                <span className="text-emerald-100 text-lg font-bold ">
                  Total
                </span>
                <span className="text-emerald-300 font-bold text-lg">
                  {" "}
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${checkoutStyles.button}
              ${
                isSubmitting
                  ? checkoutStyles.disabledButton
                  : checkoutStyles.submitButton
              }
                mt-6
              `}
            >
              {isSubmitting ? (
                <FiCheck className="mr-2 animate-spin" />
              ) : (
                <FiCheck className="mr-2" />
              )}
              {isSubmitting ? "processing Order" : "Place Order"}
            </button>

            <p className="text-center text-sm mt-4 text-emerald-400">
              by placing your order your argee to our{" "}
              <a href="#" className={checkoutStyles.link}>
                terms
              </a>{" "}
              and{" "}
              <a href="#" className={checkoutStyles.link}>
                privacy
              </a>
            </p>
          </div>
        </div>
        <div className={checkoutStyles.deliveryInfo}>
          <h3 className={checkoutStyles.deliveryTitle}>
            <FiTruck className="mr-2" />
            Delivery Information
          </h3>
          <p className={checkoutStyles.deliveryText}>
            We deliver within 10-15 minutes. Ordera placed after 9PM will be
            delivered the next morning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
