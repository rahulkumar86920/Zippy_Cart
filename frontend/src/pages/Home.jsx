import React from 'react'
import Navbar from './../components/Navbar';
import ItemsHome from '../components/ItemsHome';
import BannerHome from '../components/BannerHome';

function Home() {
    return (
       <>
       <Navbar/>
       <BannerHome/>
       <ItemsHome/>
       </>
    )
}

export default Home