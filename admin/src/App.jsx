import React from 'react'
import AdminNavbar from './components/AdminNavbar';
import { Route, Routes } from 'react-router-dom';
import AddItemPage from './components/AddItemPage';
import ListItemsPage from './components/ListItemsPage';
import OrdersPage from './components/OrdersPage';

const App = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      < AdminNavbar />

      <main className="flex-grow bg-slate-50">
        <Routes>

          <Route path='/admin/add-item' element={<AddItemPage />} />
          <Route path='/admin/list-items' element={<ListItemsPage />} />
          <Route path='/admin/orders' element={<OrdersPage />} />

          {/* default route */}
          <Route path='*' element={<AddItemPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className='bg-emerald-800 text-white py-4'>
        <div className='max-w-6xl mx-auto text-center text-sm'>
          <p>
            &copy; {new Date().getFullYear()} ZippyCart Admin Panel. All Right
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App