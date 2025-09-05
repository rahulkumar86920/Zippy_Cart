import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Navigate, replace } from "react-router-dom"
import Home from "./pages/Home.jsx"
import { CartProvider } from './pages/CartContext.jsx'
import Contact from './pages/Contact.jsx'
import Items from './pages/Items.jsx'
import Cart from './pages/Cart.jsx'
import Login from './components/Login.jsx'
import Logout from './components/Logout.jsx'
import Signup from './components/Signup.jsx'
import Navbar from './components/Navbar';

const ScrollToTop = () => {
  const { pathName } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathName]);
  return null;
}

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  )

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("authToken")))
    }
    window.addEventListener("authStateChanged", handler)
    return () => window.removeEventListener("authStateChanged", handler)
  }, [])

  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/items' element={<Items />} />
        {/*  for the cart page first will check if the user is login or not if not then user need to login first */}
        <Route path='/cart' element={isAuthenticated ? <Cart /> : <Navigate replace to="/login" />} />

        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/logout' element={<Logout />} />

        {/* Fall back to the home  */}
        <Route path='*' element={<Navigate replace to="/" />} />

      </Routes>
    </CartProvider>
  )
}

export default App