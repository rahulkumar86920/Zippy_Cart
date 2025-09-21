import React, { useEffect, useState } from "react";
import { useCart } from "../pages/CartContext";
import { itemsPageStyles } from "./../assets/dummyStyles";
import axios from "axios";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiMinus,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { groceryData } from "./../assets/dummyDataItem";

const BACKEND_URL = "http://localhost:8080";

//product cart
const ProductCart = ({ item }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const productId = item._id
  // get current quantity 
  const cartItem = cart.find(ci => ci.productId === productId);
  const lineId = cartItem?.id; 
  const quantity = cartItem?.quantity || 0;

  // add to cart
  const handleAddToCart = () => {
    addToCart(productId, 1);
  }; 

  //handle Increament
  const handleIncrement = () => {
    updateQuantity(lineId, quantity + 1);
  };

  // handle decrement
  const handleDeCrement = () => {
    if (quantity <= 1) removeFromCart(lineId);
    else updateQuantity(lineId, quantity - 1);
  };

  const rowImage = item.image || item.url;
  let imgSrc = item.image;
  if (rowImage) {
    if (rowImage.startsWith("http")) imgSrc = rowImage;
    else if (rowImage.startsWith("/")) imgSrc = `${BACKEND_URL}${rowImage}`;
    else imgSrc = `${BACKEND_URL}/uploads${rowImage}`;
  }
  return (
    <div className={itemsPageStyles.productCard}>
      {/* item image  */}
      <div className={itemsPageStyles.imageContainer}>
        <img
          src={imgSrc}
          alt={item.name}
          className={itemsPageStyles.productImage}
        />
      </div>
      {/* item description */}
      <div className={itemsPageStyles.cardContent}>
        <div className={itemsPageStyles.titleContainer}>
          <h3 className={itemsPageStyles.productTitle}>{item.name}</h3>
          <span className={itemsPageStyles.organicTag}> Organic</span>
        </div>
        <p className={itemsPageStyles.productDescription}>
          {item.description ||
            `Fresh Organic ${item.name.toLowerCase()} sourced locally`}
        </p>
        {/* item price */}
        {/* current price */}
        <div className={itemsPageStyles.priceContainer}>
          <span className={itemsPageStyles.currentPrice}>
            ₹{item.price.toFixed(2)}
          </span>
          {/* old price */}
          <span className={itemsPageStyles.oldPrice}>
            ₹{(item.price * 1.15).toFixed(2)}
          </span>
        </div>

        <div className="mt-3 ">
          {quantity > 0 ? (
            <div className={itemsPageStyles.quantityControls}>
              <button
                onClick={handleDeCrement}
                className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonLeft}`}
              >
                <FiMinus />
              </button>
              <span className={itemsPageStyles.quantityValue}>{quantity}</span>

              <button
                onClick={handleIncrement}
                className={`${itemsPageStyles.quantityButton} ${itemsPageStyles.quantityButtonRight}`}
              >
                <FiPlus />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={itemsPageStyles.addButton}
            >
              <span>Add To Cart</span>
              <span className={itemsPageStyles.addButtonArrow}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Item = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [expanedCategories, setExpanedCategories] = useState({});
  const [allexpanded, setAllExpanded] = useState(false);
  const [data, setData] = useState(groceryData);

  // search queary from url
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("seach");

    if (search) {
      setSearchTerm(search);
    }
  }, [location]);

  //  fatch from backend
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/items`)
      .then(res => { 
        const products = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        const groupped = products.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = { id: cat, name: cat, items: [] };
          acc[cat].items.push(item);
          return acc;
        }, {});
        setData(Object.values(groupped));
      })
      .catch((Error) => console.error("Fatching error", Error));
  }, []);

  // enhance search
  const itemMatchesSearch = (item, term) => {
    if (!term) return true;

    const cleanTerm = term.trim().toLowerCase();
    const searchWords = cleanTerm.split(/\s+/);

    return searchWords.every((word) => item.name.toLowerCase().includes(word));
  };

  // filter
  const filterData = searchTerm
    ? data.map(category => ({
          ...category,
          items: category.items.filter(item =>
            itemMatchesSearch(item, searchTerm)
          ),
        }))
        .filter(category => category.items.length > 0)
    : data;

  // clearSearch
  const clearSearch = () => {
    setSearchTerm("");
    navigate("/items");
  };

  // toggle category
  const toggleCategory = (categoryId) => {
    setExpanedCategories(prev => ({
      ...prev, 
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleAllCategories = () => {
    if (allexpanded) {
      setExpanedCategories({});
    } else {
      const expanded = {};
      data.forEach(category => {
        expanded[category.id] = true;
      });
      setExpanedCategories(expanded);
    }
    setAllExpanded(!allexpanded);
  };

  return (
    <div className={itemsPageStyles.page}>
      <div className={itemsPageStyles.container}>
        <header className={itemsPageStyles.header}>
          <Link to="/" className={`${itemsPageStyles.backLink} sm:mt-4`}>
            <FiArrowLeft className="mr-2" />
            <span>Back</span>
          </Link>

          {/* heading  */}
          <h1 className={itemsPageStyles.mainTitle}>
            <span className={itemsPageStyles.titleSpan}> Organic</span> Pantry
          </h1>

          <p className={itemsPageStyles.subtitle}>
            Fresh, premium-quality groceries sourced directly from trusted local
            organic farms.
          </p>
          {/* this is for the title diveder */}
          <div className={itemsPageStyles.titleDivider}>
            <div className={itemsPageStyles.dividerLine} />
          </div>
        </header>

        {/* Search bar  */}

        <div className={itemsPageStyles.searchContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
              }
            }}
            className={itemsPageStyles.searchForm}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hey :) What Products would you like to purchase ?"
              className={itemsPageStyles.searchInput}
            />

            <button type="submit" className={itemsPageStyles.searchButton}>
              <FiSearch className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={toggleAllCategories}
            className={itemsPageStyles.expandButton}
          >
            <span className="mr-2 font-medium">
              {allexpanded ? "Collapse All" : "Expand All"}
            </span>
            {allexpanded ? (
              <FiMinus className=" text-lg" />
            ) : (
              <FiPlus className="text-lg" />
            )}
          </button>
        </div>
        {filterData.length > 0 ? (
          filterData.map((category) => {
            const isExpanded = expanedCategories[category.id] || allexpanded;
            const visibleItems = isExpanded
              ? category.items
              : category.items.slice(0, 4);
            const hasMoreItems = category.items.length > 4;

            return (
              <section
                key={category.id}
                className={itemsPageStyles.categorySection}
              >
                <div className={itemsPageStyles.categoryHeader}>
                  <div className={itemsPageStyles.categoryIcon}></div>
                  <h2 className={itemsPageStyles.categoryTitle}>
                    {category.name}
                  </h2>
                  <div className={itemsPageStyles.categoryDivider}></div>
                </div>

                <div className={itemsPageStyles.productsGrid}>
                  {visibleItems.map((item) => (
                    <ProductCart key={item.id} item={item} />
                  ))}
                </div>

                {hasMoreItems && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={itemsPageStyles.showMoreButton}
                    >
                      <span className="mr-2 font-medium">
                        {isExpanded
                          ? `show less ${category.name}`
                          : `show more ${category.name} (${
                              category.items.length - 4
                            } +)`}
                      </span>
                      {isExpanded ? (
                        <FiChevronUp className="text-lg" />
                      ) : (
                        <FiChevronDown className="text-lg" />
                      )}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className={itemsPageStyles.noProductsContainer}>
            <div className={itemsPageStyles.noProductsCard}>
              <div className={itemsPageStyles.noProductsIcon}>
                <FiSearch className="mx-auto h-16 w-16" />
              </div>

              <h3 className={itemsPageStyles.noProductsTitle}>
                No Product Found
              </h3>

              <p className={itemsPageStyles.noProductsText}>
                We couldn't find any item matching "{searchTerm}"
              </p>

              <button
                onClick={clearSearch}
                className={itemsPageStyles.clearSearchButton}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
