import React, { use, useRef, useState } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/wide_Assortment.png";
import { FaOpencart } from 'react-icons/fa';
import { navItems } from '../assets/Dummy'
import { FiUser } from "react-icons/fi";
import { useCart } from "../pages/CartContext";

const Navbar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [scrolled, setscrolled] = useState();
  const [activeTab, setactiveTab] = useState(location.pathname);
  const [Isopen, setIsOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false)
  const prevCartCounterRef = useRef(cartCount)


  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("authToken"))
  )
  const mobileMenuRef = useRef(null);

  // handle logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.clear()
    window.dispatchEvent(new Event("authStateChanged"))
    navigate("/")
  }

  return (
    <nav
      className={`
            ${navbarStyles.nav}
            ${scrolled ? navbarStyles.scrolledNav : navbarStyles.unscrolledNav}
        `}
    >
      <div className={navbarStyles.borderGradient}>
        <div className={navbarStyles.particlesContainer}>
          <div
            className={`${navbarStyles.particle} w-24 h-24 bg-emerald-500/5 -top-12 left-1/4 ${navbarStyles.floatAnimation}`}
          />
          <div
            className={`${navbarStyles.particle} w-32 h-32 bg-green-500/5 -bottom-16 left-2/3 ${navbarStyles.floatSlowAnimation}`}
          />
          <div
            className={`${navbarStyles.particle} w-16 h-16 bg-teal-500/5 -top-8 left-3/4 ${navbarStyles.floatSlowerAnimation}`}
          />
        </div>
      </div>

      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <Link to="/" className={navbarStyles.logoLink}>
            <img
              src={logo}
              alt="ZippyCart Logo"
              className={`${navbarStyles.logoImage} ${scrolled ? "h-10 w-10" : "h-12 w-12"
                }`}
            />
            <span className={navbarStyles.logoText}>ZippyCart</span>
          </Link>

          {/**dekstop view */}
          <div className={navbarStyles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${navbarStyles.navItem}
                            ${activeTab === item.path
                    ? navbarStyles.activeNavItem
                    : navbarStyles.inactiveNavItem
                  }
                            `}
              >
                <div className="flex items-center">
                  <span
                    className={`${navbarStyles.navIcon} ${activeTab === item.path
                      ? navbarStyles.activeNavItem
                      : navbarStyles.inactiveNavIcon
                      } `}>
                    {item.icon}
                  </span>
                  <span>
                    {item.name}
                  </span>
                </div>
                <div className={`${navbarStyles.navIndicator}${activeTab === item.path ? navbarStyles.activeIndicator : navbarStyles.inactiveIndicator} `} />

              </Link>
            ))}
          </div>
          {/**mobile hamburger*/}
          <div className={navbarStyles.iconsContainer}>
            {isLoggedIn ? (

              <button onClick={handleLogout}
                aria-level="Logout">
                <FiUser className={navbarStyles.loginIcon} />
                <span className="ml-1 text-white">Logout</span>
              </button>
            ) : (
              <Link to="login" className={navbarStyles.loginLink}>
                <FiUser className={navbarStyles.loginIcon} />
                <span className="ml-2 text-white">Logout</span>
              </Link>
            )
            }
            {/**this for the cart icon */}
            <Link to="/cart" className={navbarStyles.cartLink}>
              <FaOpencart className={`${navbarStyles.cartIcon} ${cartBounce ? "animate-bounce" : " "}`} />
              {cartCount > 0 && (
                <span className={navbarStyles.cartBadge}>{cartCount}</span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
