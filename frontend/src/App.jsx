import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx"
import { CartProvider } from './pages/CartContext.jsx'

function App() {
  return (
    <CartProvider>
       <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </CartProvider>
  )
}

export default App