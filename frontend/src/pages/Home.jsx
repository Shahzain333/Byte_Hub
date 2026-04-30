import React from 'react'
import HeroSection from '../components/HeroSection'
import Categories from '../components/Categories'
import Menus from '../components/Menus'
import NewsLetter from '../components/NewsLetter'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Categories/>
      <Menus/>
      <NewsLetter/>
      <Testimonials/>
    </div>
  )
}

export default Home