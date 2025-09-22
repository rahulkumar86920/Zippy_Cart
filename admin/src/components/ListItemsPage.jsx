import React, { useEffect, useState } from "react";
import { listItemsPageStyles as styles } from "./../assets/adminStyle";
import { FiFilter, FiPackage, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const StatsCard = ({ icon: Icon, color, border, label, value }) => (
  <div className={styles.statsCard(border)}>
    <div className={styles.statsCardInner}>
      <div className={styles.statsCardIconContainer(color)}>
        <Icon className={styles.statsCardIcon(color)} />
      </div>
      <div>
        <p className={styles.statsCardLabel}>{label}</p>
        <p className={styles.statsCardValue}>{value}</p>
      </div>
    </div>
  </div>
);

const ListItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await axios.get("https://zippy-cart-backend.onrender.com/api/items");
        const data = response.data;

        const withUrls = data.map((item) => ({
          ...item,
          imageUrl: item.image
            ? `https://zippy-cart-backend.onrender.com${item.image}`
            : null,
        }));

        const itemCategories = data.map((item) => item.category);
        const uniqueCategories = ["ALL", ...new Set(itemCategories)];

        setCategories(uniqueCategories);
        setItems(withUrls);
        setFilteredItem(withUrls);
      } catch (error) {
        console.log("failled to load itens", error);
        alert("Could not load products. see console for the errors");
      }
    };
    loadItem();
  }, []);

  useEffect(() => {
    if (selectedCategory === "ALL") {
      setFilteredItem(items);
    } else {
      setFilteredItem(
        items.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory, items]);

  //delete products
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product")) return;

    try {
      await axios.delete(`https://zippy-cart-backend.onrender.com/api/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      setFilteredItem((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.log(
        "Delete failled",
        error.response?.status,
        error.response?.data
      );
      alert(
        `Delete Failed : ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>Product Inverntory</h1>
          <p className={styles.headerSubtitle}>Manage your product listings</p>
        </div>

        <div className={styles.statsGrid}>
          <StatsCard
            icon={FiPackage}
            color="bg-emerald-100"
            border="bg-emerald-500"
            label="Total Products"
            value={items.length}
          />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.headerFlex}>
            <h2 className={styles.headerTitleSmall}>
              Products ({filteredItems.length})
              {selectedCategory !== "ALL" && `in ${selectedCategory}`}
            </h2>
            <div className={styles.filterContainer}>
              <div className={styles.filterSelectContainer}>
                <div className={styles.filterIconContainer}>
                  <FiFilter className={styles.filterIcon} />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className={styles.filterSelectArrow}>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateIcon}>
                <FiPackage className={styles.emptyStateIcon} />
              </div>

              <h3 className={styles.emptyStateTitle}>No products found</h3>
              <p className={styles.emptyStateText}>
                {selectedCategory === "ALL"
                  ? "Try adding a new product"
                  : `No product in ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Product</th>
                    <th className={styles.tableHeaderCell}>Category</th>
                    <th className={styles.tableHeaderCell}>Price</th>
                    <th className={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>

                  {filteredItems.map(item => (
                    <tr key={item._id} className={styles.tableRowHover}>
                      <td className={styles.tableDataCell}>
                        <div className={styles.productCell}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className={styles.productImage}
                            />
                          ) : (
                            <div className={styles.placeholderImage} />
                          )}
                          <div >
                            <div className={styles.productName}>
                              {item.name}
                            </div>
                            <div className={styles.productDescription}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className={styles.tableDataCell}>
                        <span className={styles.categoryText}>
                          {item.category}
                        </span>
                      </td>

                      <td className={styles.tableDataCell}>
                        <div className={styles.price}>
                          ₹{item.price.toFixed(2)}
                        </div>
                        {
                          item.oldPrice > item.price && (
                            <div className={styles.oldPrice}>
                              ₹{item.oldPrice.toFixed(2)}
                            </div>
                          )
                        }
                      </td>

                      <td className={styles.tableDataCell}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className={styles.actionButtons}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListItemsPage;
