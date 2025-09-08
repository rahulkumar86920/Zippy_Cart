import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartPage from '../components/CartPage'

const Cart = () => {
  // Scroll to top when this component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <CartPage />
      <Footer />
    </div>
  )
}

export default Cart
