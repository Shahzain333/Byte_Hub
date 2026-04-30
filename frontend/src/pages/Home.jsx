import React from 'react'
import HeroSection from '../components/HeroSection'
import Categories from '../components/Categories'
import Menus from '../components/Menus'
import NewsLetter from '../components/NewsLetter'
import Testimonials from '../components/Testimonials'
import Testimonial2 from '../components/Testimonial2'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Categories/>
      <Menus/>
      <NewsLetter/>
      <Testimonials/>
      {/* <Testimonial2/> */}
    </div>
  )
}

export default Home