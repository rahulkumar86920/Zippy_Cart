import React, { useEffect, useState } from "react";
import { itemsHomeStyles } from "../assets/dummyStyles";
import BannerHome from "./BannerHome";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import { FaMinus, FaPlus, FaShoppingCart, FaThList } from "react-icons/fa";
import { categories, products } from "../assets/dummyData.jsx";

function ItemsHome() {
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("activeCategory" || "ALL");
  });

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);

  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");

  // search feature 
  const productMatchSearch = (product, term) => {
    if (!term) return true;
    const cleanTerm = term.trim().toLowerCase();
    const searchWords = cleanTerm.split(/\s+/)

    return searchWords.every(word =>
      product.name.toLowerCase().inclues(word))
  }

  // serach across all the products 
  const searchedProducts = searchTerm
    ? products.filter(product =>
      productMatchSearch(product, searchTerm))
    : (activeCategory === "All"
      ? products : products.filter((product) => product.category === activeCategory))


  const getQuantity = (productId) => {
    const item = cart.find((ci) => ci.id === productId)
    return item ? item.quantity : 0;
  }

  // code to incese the quantity of the item in the cart page
  const handleIncrease = (product) => addToCart(product, 1);

  // code to decrease the quantity of the iten from the cart 
  const handleDecrease = (product) => {
    console.log("product", product)
    const qtr = getQuantity(product.id) 
    console.log("qtr", qtr)
    if (qtr > 1) updateQuantity(product.id, qtr - 1)
    else removeFromCart(product.id)
  }

  // redirect to / items 
  const redirectToItems = () => {
    navigate('/items', { state: { category: activeCategory } })
  }

  const handleSerach = (term) => {
    SetSearchTerm(term);
  };

  // create side bar categories
  const sidebarCategories = [
    {
      name: "All Items",
      icon: <FaThList className="text-lg" />,
      value: "All",
    },
    ...categories,
  ];

  return (
    <div className={itemsHomeStyles.page}>
      {/* <BannerHome onsearch={handleSerach}/> */}

      <div className="flex flex-col lg:flex-row flex-1">
        <aside className={itemsHomeStyles.sidebar}>
          <div className={itemsHomeStyles.sidebarHeader}>
            <h1
              style={{
                fontFamily: "'playfair display', serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
              className={itemsHomeStyles.sidebarTitle}
            >
              FreshCart
            </h1>
            <div className={itemsHomeStyles.sidebarDivider} />
          </div>

          <div className={itemsHomeStyles.categoryList}>
            <ul className="space-y-3">
              {sidebarCategories.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => {
                      setActiveCategory(category.value || category.name);
                      setSearchTerm("");
                    }}
                    className={`${itemsHomeStyles.categoryItem} ${activeCategory === (category.value || category.name) &&
                      !searchTerm
                      ? itemsHomeStyles.activeCategory
                      : itemsHomeStyles.inactiveCategory
                      }`}
                  >
                    <div className={itemsHomeStyles.categoryIcon}>
                      {category.icon}
                    </div>
                    <span className={itemsHomeStyles.categoryName}>
                      {" "}
                      {category.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content is written here */}
        <main className={itemsHomeStyles.mainContent}>
          {/* mobile category scroll */}
          <div className={itemsHomeStyles.mobileCategories}>
            <div className="flex space-x-4">
              {sidebarCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.value || cat.name);
                    searchTerm(" ");
                  }}
                  className={`${itemsHomeStyles.mobileCategoryItem} ${activeCategory === (cat.value || cat.name) && !searchTerm
                    ? itemsHomeStyles.activeMobileCategory
                    : itemsHomeStyles.inactiveMobileCategory
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {/* Search Result  */}
          {searchTerm && (
            <div className={itemsHomeStyles.searchResults}>
              <div className="flex items-center justify-center">
                <span className="text-emerald-700 font-medium">
                  Serch Result for:{" "}
                  <span className="font-bold">{searchTerm}</span>
                </span>
                <button
                  onClick={() => searchTerm(" ")}
                  className="ml-4 text-emerald-700
                 hover:text-shadow-emerald-700 p-1"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          {/* section title  */}
          <div className="text-center mb-6">
            <h1
              className={itemsHomeStyles.sectionTitle}
              style={{
                fontFamily: "' playfair Display',serif ",
              }}
            >
              {searchTerm
                ? "search Result "
                : activeCategory === "All"
                  ? "Featured Product"
                  : `${activeCategory} `}
            </h1>
            <div className={itemsHomeStyles.sectionDivider} />
          </div >

          {/* Products grid */}
          <div className={itemsHomeStyles.productsGrid}>
            {
              searchedProducts.length > 0 ? (
                searchedProducts.map((product) => {
                  const qty = getQuantity(product.id)
                  return (
                    <div key={product.id}
                      className={itemsHomeStyles.productCard}>
                      <div className={itemsHomeStyles.productContent}>
                        <img src={product.image} alt={product.name}
                          className={itemsHomeStyles.productImage}
                          onError={(e) => {
                            e.target.onError = null
                            e.target.parentNode.innerHTML = `
                          <div className=" flex items-center justify-center w-full h-full bg-gray-200" >
                          <span className="text-gray-500 text-sm">No image <span/>
                          <div/>`
                          }} />
                      </div>

                      <div className={itemsHomeStyles.productContent}>

                        <h3 className={itemsHomeStyles.productTitle}>
                          {product.name}
                        </h3>

                        <div className={itemsHomeStyles.priceContainer}>
                          <div>
                            <p className={itemsHomeStyles.currentPrice}>
                              ₹{product.price.toFixed(2)}
                            </p>

                            <span className={itemsHomeStyles.oldPrice}>
                              ₹{(product.price * 1.2).toFixed(2)}
                            </span>

                          </div>
                          {/* add controls here */}
                          {
                            qty === 0 ? (
                              <button onClick={() => handleIncrease(product)} className={itemsHomeStyles.addButton}>
                                <FaShoppingCart className="mr-2" />
                                Add
                              </button>
                            ) : (
                              <div className={itemsHomeStyles.quantityControls}>
                                <button onClick={() => handleDecrease(product)}
                                  className={itemsHomeStyles.quantityButton}>
                                  <FaMinus />
                                </button>

                                <span className="font-bold">{qty}</span>
                                <button onClick={() => handleIncrease(product)} className={itemsHomeStyles.quantityButton}>
                                  <FaPlus />
                                </button>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className={itemsHomeStyles.noProducts}>
                  <div className={itemsHomeStyles.noProductsText}>
                    No Product Found
                  </div>
                </div>
              )
            }
          </div>
        </main>
      </div>
    </div>
  );
}

export default ItemsHome;
