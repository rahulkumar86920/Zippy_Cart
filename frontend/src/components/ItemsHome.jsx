import React, { useState } from 'react'
import { itemsHomeStyles } from '../assets/dummyStyles'
import BannerHome from './BannerHome';

function ItemsHome() {
  const [searchTerm, SetSearchTerm] = useState("")

  const handleSerach = (term) => {
    SetSearchTerm(term)
  }
  return (


    <div className={itemsHomeStyles.page}>
      <BannerHome />
    </div>
  )
}

export default ItemsHome