import React from 'react';
import Navbar from './../components/Navbar';
import ItemsHome from '../components/ItemsHome';
import BannerHome from '../components/BannerHome';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Navbar />
      {/* <BannerHome /> */}
      <ItemsHome />
      <Footer/>
    </>
  );
}

export default Home;
