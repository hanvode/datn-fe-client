import React from 'react'
import Featured from '../../components/featured/Featured';
import FoodReview from '../../components/foodReview/FoodReview';
import Footer from '../../components/footer/Footer';
import Header  from '../../components/header/Header'
import MailList from '../../components/mailList/MailList';
import Navbar  from '../../components/navbar/Navbar'
import PropertyList from '../../components/propertyLIst/PropertyList';
import './home.css'
const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle">Category</h1>
        <PropertyList/>
        <h1 className="homeTitle">Homes guests love</h1>
        <FoodReview/>
        <MailList/>
      </div>
      <Footer/>
    </div>
  )
};
export default Home;