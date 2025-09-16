import React, { useEffect, useState } from "react";
import { ordersPageStyles as styles } from "../assets/adminStyle";
import {
  FiCheck,
  FiEdit,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import { BsCurrencyRupee } from "react-icons/bs";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const fatchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/orders");
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.log("fatching orders error", error);
    }
  };

  useEffect(() => {
    fatchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.customer.phone.includes(term) ||
          (order.customer.email &&
            order.customer.email.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((order) => order.status === statusFilter);
    }
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // update the orders
  const updateOrdersStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setFilteredOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("error in updating order:", error);
    }
  };

  //cancel order
  const cancelOrder = (orderId) => {
    updateOrdersStatus(orderId, "Cancelled");
  };

  //model open for more details of order
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // close model
  const closeModel = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        {/* header */}
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>Order Management </h1>
          <p className={styles.headerSubtitle}>
            View, manage, and track orders
          </p>
        </div>
        {/* stats grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statsCard("border-blue-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg-blue-100")}>
                <FiPackage className={styles.statsCardIcon("text-blue-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Track Orders</p>
                <p className={styles.statsCardValue}>{orders.length}</p>
              </div>
            </div>
          </div>

          <div className={styles.statsCard("border-amber-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg-amber-100")}>
                <FiTruck className={styles.statsCardIcon("text-amber-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Processing</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.status === "Processing").length}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.statsCard("border-emerald-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg-emerald-100")}>
                <FiCheck className={styles.statsCardIcon("text-emerald-600")} />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Delivered</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.status === "Delivered").length}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.statsCard("border-red-500")}>
            <div className={styles.statsCardInner}>
              <div className={styles.statsCardIconContainer("bg-red-100")}>
                <BsCurrencyRupee
                  className={styles.statsCardIcon("text-red-600")}
                />
              </div>
              <div>
                <p className={styles.statsCardLabel}>Pending Payment</p>
                <p className={styles.statsCardValue}>
                  {orders.filter((o) => o.status === "unpaid").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* order table */}
        <div className={styles.contentContainer}>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeaderCell}>Order ID</th>
                  <th className={styles.tableHeaderCell}>Customer</th>
                  <th className={styles.tableHeaderCell}>Date</th>
                  <th className={styles.tableHeaderCell}>Items</th>
                  <th className={styles.tableHeaderCell}>Total</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Payment</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>

              <tbody className={styles.tableBody}>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyStateCell}>
                      <div className={styles.emptyStateContainer}>
                        <FiPackage className={styles.emptyStateIcon} />
                        <h3 className={styles.emptyStateTitle}>
                          {" "}
                          No orders found
                        </h3>
                        <p className={styles.emptyStateText}>
                          {" "}
                          Try changing your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className={styles.tableRowHover}>
                      <td
                        className={`${styles.tableDataCell} ${styles.orderId}`}
                      >
                        {order.orderId}
                      </td>

                      <td className={styles.tableDataCell}>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer.phone}
                        </div>
                      </td>

                      <td
                        className={`${styles.tableDataCell} text-sm text-gray-500`}
                      >
                        {order.date}
                      </td>

                      <td
                        className={`${styles.tableDataCell} text-sm text-gray-500`}
                      >
                        {order.items.length} items
                      </td>

                      <td className={`${styles.tableDataCell} font-medium`}>
                        ₹{order.total.toFixed(2)}
                      </td>

                      <td className={styles.tableDataCell}>
                        <span className={styles.statusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>

                      <td className={styles.tableDataCell}>
                        <span
                          className={styles.paymentBadge(order.paymentStatus)}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className={styles.tableDataCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.viewButton}
                            onClick={() => viewOrderDetails(order)}
                          >
                            View
                          </button>

                          <button
                            className={styles.cancelButton(
                              order.status === "cancelled" ||
                                order.status === "Delivered"
                            )}
                            disabled={
                              order.status === "cancelled" ||
                              order.status === "Delivered"
                            }
                            onClick={() => cancelOrder(order._id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* order details */}

      {isDetailModalOpen && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* modal header */}

            <div className={styles.modalHeader}>
              <div className="flrx justify-between items-center">
                <h2 className={styles.modalHeaderTitle}>Order details :</h2>
                <button
                  onClick={closeModel}
                  className={styles.modalHeaderClose}
                >
                  <FiX size={24} />
                </button>
              </div>

              <p className="text-gray-600 mt-1">
                Ordered on {selectedOrder.date}
              </p>
            </div>

            {/* modal body */}
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>

                {/* left side */}
                <div>
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      <FiUser className={styles.modalIcon} />
                      Customer information
                    </h3>
                    <div className={styles.modalInfoBox}>
                      <div className="mb-3">
                        <div className="font-medium">
                          {selectedOrder.customer.name}
                        </div>
                        <div className="text-gray-600 flex item-center mt-1">
                          <FiMail className="mr-2 flex-shrink-0" />
                          {selectedOrder.customer.email || "No emial provided"}
                        </div>
                        <div className="text-gray-600 flex item-center mt-1">
                          <FiPhone className="mr-2 flex-shrink-0" />
                          {selectedOrder.customer.phone || "No phone provided"}
                        </div>
                        <div className="flex items-start mt-3">
                          <FiMapPin className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                          <div className="text-gray-600">
                            {selectedOrder.customer.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* order notes */}
                  {selectedOrder.notes && (
                    <div className={styles.modalSection}>
                      <h3 className={styles.modalSectionTitle}>
                        <FiEdit className={styles.modalIcon} />
                        Delivery Notes
                      </h3>
                      <div className={styles.modalNoteBox}>
                        <p className="text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}
                  {/* status control */}
                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>
                      Update Order Status
                    </h3>
                    <div className={styles.modalStatusControl}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700  mb-2">
                          Order Status
                        </label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            selectedOrder({
                              ...selectedOrder,
                              status: newStatus,
                            });
                            updateOrdersStatus(selectedOrder._id, newStatus);
                          }}
                          className={styles.modalSelect}
                        >
                          {statusOptions
                            .filter((o) => o !== "All")
                            .map((option) => (
                              <option value={option} key={option}>
                                {option}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* right side */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
