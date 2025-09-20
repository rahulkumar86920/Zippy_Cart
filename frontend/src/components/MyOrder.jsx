import React, { useEffect, useState } from "react";
import axios from "axios";
import { ordersPageStyles } from "./../assets/dummyStyles";
import { FiArrowLeft, FiPackage, FiSearch ,FiX} from "react-icons/fi";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData.email || "";

  //fatching orders
  const fetchAndFilterOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders");
      console.log("Orders from backend:", res.data); // 👈 add this line
      const allOrders = res.data;

      const mine = allOrders.filter(
        (o) => o.customer?.email?.toLowerCase() === userEmail.toLowerCase()
      );

      setOrders(mine);
    } catch (error) {
      console.error("Error in fatching the order", error);
    }
  };

  useEffect(() => {
    fetchAndFilterOrders();
  }, []);

  // search filtering
  useEffect(() => {
    setFilteredOrders(
      orders.filter((o) => {
        const orderId = (o.orderId || o._id || "").toString().toLowerCase();
        const matchOrderId = orderId.includes(searchTerm.toLowerCase());

        const matchItem = o.items?.some((i) =>
          (i.name || i.product?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

        return matchOrderId || matchItem;
      })
    );
  }, [orders, searchTerm]);

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
    <div className={ordersPageStyles.page}>
      <div className={ordersPageStyles.container}>
        {/* headers */}
        <div className={ordersPageStyles.header}>
          <a href="#" className={ordersPageStyles.backLink}>
            <FiArrowLeft className="mr-2" />
            Back to Account
          </a>
          <h1 className={ordersPageStyles.mainTitle}>
            My <span className={ordersPageStyles.titleSpan}>Orders</span>
          </h1>
          <p className={ordersPageStyles.subtitle}>
            View your order history and track current order
          </p>
          <div className={ordersPageStyles.titleDivider}>
            <div className={ordersPageStyles.dividerLine} />
          </div>
        </div>
        {/* search */}
        <div className={ordersPageStyles.searchContainer}>
          <div className={ordersPageStyles.searchForm}>
            <input
              type="text"
              placeholder="Search orders or products..."
              className={ordersPageStyles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={ordersPageStyles.searchButton}>
              <FiSearch size={18} />
            </button>
          </div>
        </div>
        {/* orders table */}
        <div className={ordersPageStyles.ordersTable}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={ordersPageStyles.tableHeader}>
                <tr>
                  <th className={ordersPageStyles.tableHeaderCell}>Order ID</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Date</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Items</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Total</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Status</th>
                  <th className={ordersPageStyles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-700/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiPackage className="text-emerald-400 text-4xl mb-1" />
                        <h3 className="text-lg font-medium text-emerald-100 mb-1">
                          {" "}
                          No orders Found
                        </h3>
                        <span className="text-emerald-300">
                          Try adjusting your search criteria
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className={ordersPageStyles.tableRow}>
                      <td
                        className={`${ordersPageStyles.tableCell} font-medium text-emerald-200`}
                      >
                        {order.orderId || order._id}
                      </td>
                      <td className={`${ordersPageStyles.tableCell} text-sm`}>
                        {order.date}
                      </td>
                      <td
                        className={`${ordersPageStyles.tableCell} text-emerald-100`}
                      >
                        {order.items?.length} items
                      </td>
                      <td
                        className={`${ordersPageStyles.tableCell} font-medium`}
                      >
                        ₹{order.total?.toFixed(2)}
                      </td>
                      <td className={`${ordersPageStyles.tableCell} text-sm`}>
                        <span
                          className={`${ordersPageStyles.statusBadge} ${
                            order.status === "Delivered"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : order.status === "Processing"
                              ? "bg-amber-500/20 text-amber-200"
                              : order.status === "Shipped"
                              ? "bg-blue-500/20 text-blue-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className={ordersPageStyles.tableCell}>
                        <button
                          className={ordersPageStyles.actionButton}
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* order detail model */}
      {
        isDetailModalOpen && selectedOrder &&(
          <div className={ordersPageStyles.modalOverlay}>
            <div className={ordersPageStyles.modalContainer}>
                {/*   modal header */}
                <div className={ordersPageStyles.modalHeader}>
                    <div className="flex justify-between items-center">
                        <h2 className={ordersPageStyles.modalTitle}>
                          Order Details {selectedOrder._id}
                        </h2>
                        <button 
                        className={ordersPageStyles.modalCloseButton}
                        onClick={closeModel}
                        >
                            <FiX size={24}/>
                        </button>
                    </div>
                    <p className="text-emerald-300 mt-1">
                      Ordered on {selectedOrder.date}
                    </p>
                </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default MyOrder;
