import React, { useState } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/wide_Assortment.png";
import { FaOpencart } from 'react-icons/fa';
import { navItems } from '../assets/Dummy'

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setscrolled] = useState();
  const [activeTab, setactiveTab] = useState(location.pathname);

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
