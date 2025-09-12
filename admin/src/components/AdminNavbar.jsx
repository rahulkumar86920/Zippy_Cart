import React, { useState } from 'react'
import { adminNavbarStyles } from './../assets/adminStyle';
import { FiMenu, FiPackage, FiPlus, FiPlusCircle, FiShoppingBag, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom"

const AdminNavbar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    return (
        <nav className={adminNavbarStyles.nav}>
            <div className={adminNavbarStyles.container}>
                <div className={adminNavbarStyles.mainFlex}>
                    {/* logo */}
                    <div className={adminNavbarStyles.logoContainer}>
                        <div className={adminNavbarStyles.logoIconContainer}>
                            <FiPackage className={adminNavbarStyles.logoIcon} />
                        </div>
                        <h1 className={adminNavbarStyles.logoText}>
                            <span className={adminNavbarStyles.logoAccent}>ZippyCart</span> Admin
                        </h1>
                    </div>
                    {/* desktop links */}
                    <div className={adminNavbarStyles.desktopNavLinks}>
                        <NavLink to="/admin/add-item" className={adminNavbarStyles.navLink}>
                            <FiPlus className='mr-2' />
                            Add Products
                        </NavLink>

                        <NavLink to="/admin/List-items" className={adminNavbarStyles.navLink}>
                            <FiPlusCircle className='mr-2' />
                            List Items
                        </NavLink>

                        <NavLink to="/admin/Orders" className={adminNavbarStyles.navLink}>
                            <FiShoppingBag className='mr-2' />
                            Orders
                        </NavLink>
                    </div>

                    {/* mobile view  */}
                    <div className={adminNavbarStyles.mobileMenuButton}>
                        <button onClick={toggleMobileMenu} className={adminNavbarStyles.menuButton}>
                            {
                                isMobileMenuOpen ? (
                                    <FiX className='h-6 w-6' />
                                ) : (
                                    <FiMenu className='h-6 w-6' />
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* mobile links */}
            <div className={`${adminNavbarStyles.mobileMenuContainer} 
            ${isMobileMenuOpen ? "block" : "hidden"}`}>
                <div className={adminNavbarStyles.mobileMenuInner}>
                    <NavLink to="/admin/add-item"
                        onClick={closeMobileMenu}
                        className={adminNavbarStyles.mobileNavLink}
                    >
                        <FiPlusCircle className='mr-3 ml-1' />
                        Add Products
                    </NavLink>

                    <NavLink to="/admin/list-items"
                        onClick={closeMobileMenu}
                        className={adminNavbarStyles.mobileNavLink}
                    >
                        <FiPackage className='mr-3 ml-1' />
                        List Items
                    </NavLink>

                    <NavLink to="/admin/orders"
                        onClick={closeMobileMenu}
                        className={adminNavbarStyles.mobileNavLink}
                    >
                        <FiShoppingBag className='mr-3 ml-1' />
                        Orders
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar