import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuDetails from './pages/MenuDetails'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import BookTable from './pages/BookTable'
import MyBooking from './pages/MyBooking'
import MyOrder from './pages/MyOrder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'

function App() {

  const adminPath = useLocation().pathname.includes("admin")

  return (
    <div>
      
      <Toaster/>

      {!adminPath && <Navbar/> }

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/menu' element={<Menu/>}/>
        <Route path='/menu-details/:id' element={<MenuDetails/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/book-table' element={<BookTable/>}/>
        <Route path='/my-bookings' element={<MyBooking/>}/>
        <Route path='/my-orders' element={<MyOrder/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </div>
  )
}

export default App
