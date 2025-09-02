import React, { useEffect, useState } from "react"
import { itemsHomeStyles } from "../assets/dummyStyles"
import BannerHome from "./BannerHome"
import { useNavigate } from "react-router-dom"
import { useCart } from "../pages/CartContext"
import { FaChevronRight, FaMinus, FaPlus, FaShoppingCart, FaThList } from "react-icons/fa"
import { categories, products } from "../assets/dummyData.jsx"

function ItemsHome() {
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("activeCategory") || "All"
  })

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory)
  }, [activeCategory])

  const navigate = useNavigate()
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()

  // Match products to search term
  const productMatchSearch = (product, term) => {
    if (!term) return true
    const cleanTerm = term.trim().toLowerCase()
    const searchWords = cleanTerm.split(/\s+/)
    return searchWords.every((word) => product.name.toLowerCase().includes(word))
  }

  // Filter products
  const searchedProducts = searchTerm
    ? products.filter((product) => productMatchSearch(product, searchTerm))
    : activeCategory === "All"
    ? products
    : products.filter((product) => product.category === activeCategory)

  const getQuantity = (productId) => {
    const item = cart.find((ci) => ci.id === productId)
    return item ? item.quantity : 0
  }

  const handleIncrease = (product) => addToCart(product, 1)

  const handleDecrease = (product) => {
    const qty = getQuantity(product.id)
    if (qty > 1) updateQuantity(product.id, qty - 1)
    else removeFromCart(product.id)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // Sidebar categories
  const sidebarCategories = [
    { name: "All Items", icon: <FaThList className="text-lg" />, value: "All" },
    ...categories,
  ]

  return (
    <div className={itemsHomeStyles.page}>
      
      {/* Banner with search */}
      <BannerHome onSearch={handleSearch} />

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar */}
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
                      setActiveCategory(category.value || category.name)
                      setSearchTerm("")
                    }}
                    className={`${itemsHomeStyles.categoryItem} ${
                      activeCategory === (category.value || category.name) &&
                      !searchTerm
                        ? itemsHomeStyles.activeCategory
                        : itemsHomeStyles.inactiveCategory
                    }`}
                  >
                    <div className={itemsHomeStyles.categoryIcon}>
                      {category.icon}
                    </div>
                    <span className={itemsHomeStyles.categoryName}>
                      {category.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={itemsHomeStyles.mainContent}>
          {/* Search Result Info */}
          {searchTerm && (
            <div className={itemsHomeStyles.searchResults}>
              <div className="flex items-center justify-center">
                <span className="text-emerald-700 font-medium">
                  Search Result for:{" "}
                  <span className="font-bold">{searchTerm}</span>
                </span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-4 text-emerald-700 hover:text-shadow-emerald-700 p-1"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Section title */}
          <div className="text-center mb-6">
            <h1
              className={itemsHomeStyles.sectionTitle}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {searchTerm
                ? "Search Results"
                : activeCategory === "All"
                ? "Featured Products"
                : `${activeCategory}`}
            </h1>
            <div className={itemsHomeStyles.sectionDivider} />
          </div>

          {/* Products Grid */}
          <div className={itemsHomeStyles.productsGrid}>
            {searchedProducts.length > 0 ? (
              searchedProducts.map((product) => {
                const qty = getQuantity(product.id)
                return (
                  <div
                    key={product.id}
                    className={itemsHomeStyles.productCard}
                  >
                    <div className={itemsHomeStyles.productContent}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={itemsHomeStyles.productImage}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.parentNode.innerHTML = `
                            <div class="flex items-center justify-center w-full h-full bg-gray-200">
                              <span class="text-gray-500 text-sm">No image</span>
                            </div>`
                        }}
                      />
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

                        {qty === 0 ? (
                          <button
                            onClick={() => handleIncrease(product)}
                            className={itemsHomeStyles.addButton}
                          >
                            <FaShoppingCart className="mr-2" />
                            Add
                          </button>
                        ) : (
                          <div className={itemsHomeStyles.quantityControls}>
                            <button
                              onClick={() => handleDecrease(product)}
                              className={itemsHomeStyles.quantityButton}
                            >
                              <FaMinus />
                            </button>
                            <span className="font-bold">{qty}</span>
                            <button
                              onClick={() => handleIncrease(product)}
                              className={itemsHomeStyles.quantityButton}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        )}
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
                <button
                  onClick={() => setSearchTerm("")}
                  className={itemsHomeStyles.clearSearchButton}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* View All Button */}
          {!searchTerm && (
            <div className="text-center">
              <button className={itemsHomeStyles.viewAllButton}>
                View All{" "}
                {activeCategory === "All" ? "Products" : activeCategory}
                <FaChevronRight className="ml-3" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ItemsHome
