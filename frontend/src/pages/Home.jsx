import React from 'react'
import HeroSection from '../components/HeroSection'
import Categories from '../components/Categories'
import Menus from '../components/Menus'
import NewsLetter from '../components/NewsLetter'
import Testimonials from '../components/Testimonials'
import Testimonial2 from '../components/Testimonial2'
import Faqs from './Faqs'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Categories/>
      <Menus/>
      {/* <NewsLetter/> */}
      <Testimonials/>
      <Faqs/>
      {/* <Testimonial2/> */}
    </div>
  )
}

export default Home