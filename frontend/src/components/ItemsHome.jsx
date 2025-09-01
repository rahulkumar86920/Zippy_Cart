import React, { useEffect, useState } from 'react'
import { itemsHomeStyles } from '../assets/dummyStyles'
import BannerHome from './BannerHome'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../pages/CartContext'
import { FaThList } from 'react-icons/fa'
import { categories } from "../assets/dummyData"



function ItemsHome() {

  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("activeCategory" || "ALL")
  })

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory)
  }, [activeCategory])

  const navigate = useNavigate();
  const { cart } = useCart();

  const [searchTerm, setSearchTerm] = useState("")

  const handleSerach = (term) => {
    SetSearchTerm(term)
  }

  // create side bar categories
  const sidebarCategories = [
    {
      name: 'All Items',
      icon: <FaThList className='text-lg' />,
      value: "All"
    },
    ...categories
  ]

  return (
    <div className={itemsHomeStyles.page}>
      {/* <BannerHome onsearch={handleSerach}/> */}


      <div className='flex flex-col lg:flex-row flex-1'>
        <aside className={itemsHomeStyles.sidebar}>
          <div className={itemsHomeStyles.sidebarHeader}>
            <h1 style={{
              fontFamily: "'playfair display', serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
            }} className={itemsHomeStyles.sidebarTitle}>
              FreshCart
            </h1>
            <div className={itemsHomeStyles.sidebarDivider} />
          </div>

          <div className={itemsHomeStyles.categoryList}>
            <ul className='space-y-3'>
              {sidebarCategories.map((category) => (
                <li key={category.name}>
                  <button onClick={() => {
                    setActiveCategory(category.value || category.name)
                    setSearchTerm("")
                  }}
                    className={`${itemsHomeStyles.categoryItem} ${(activeCategory === (category.value || category.name)) && !searchTerm
                      ? itemsHomeStyles.activeCategory
                      : itemsHomeStyles.inactiveCategory}`}
                  >
                    <div className={itemsHomeStyles.categoryIcon}>
                      {category.icon}
                    </div>
                    <span className={itemsHomeStyles.categoryName}> {category.name}</span>
                  </button>
                </li>
              ))
              }
            </ul>
          </div>
        </aside>
        {/* Main Content is written here */}

        <main className={itemsHomeStyles.mainContent}>
          {/* mobile category scroll */}
          <div className={itemsHomeStyles.mobileCategories}>
            <div className='flex space-x-4'>
              {sidebarCategories.map((cat) => (
                <button key={cat.name} onClick={() => {
                  setActiveCategory(cat.value || cat.name)
                  searchTerm(" ")
                }}
                  className={`${itemsHomeStyles.mobileCategoryItem} ${activeCategory === (cat.value || cat.name) && !searchTerm
                    ? itemsHomeStyles.activeMobileCategory
                    : itemsHomeStyles.inactiveMobileCategory}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {/* Search Result  */}
          {searchTerm && (
            <div className={itemsHomeStyles.searchResults}>
              <div className='flex items-center justify-center'>
                <span className='text-emerald-700 font-medium'>
                  Serch Result for: <span className='font-bold'>{searchTerm}</span>
                </span>
                <button onClick={() => searchTerm(" ")} className='ml-4 text-emerald-700
                 hover:text-shadow-emerald-700 p-1'>
                  Clear
                </button>
              </div>
            </div>
          )}
          {/* section title  */}
          <div className='text-center mb-6'>
            <h1 className={itemsHomeStyles.sectionTitle} style={{
              fontFamily: "' playfair Display',serif "
            }}>{
                searchTerm ? "search Result "
                  : (activeCategory === "All" ? "Featured Product" : `${activeCategory} `)
              }
            </h1>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ItemsHome