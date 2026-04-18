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
import Footer from './components/Footer'
import AdminLogin from './pages/admin/AdminLogin'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AddCategory from './pages/admin/AddCategory'
import AddMenu from './pages/admin/AddMenu'
import Categories from './pages/admin/Categories'
import Menus from './pages/admin/Menus'
import Orders from './pages/admin/Orders'
import Bookings from './pages/admin/Bookings'

function App() {

  const adminPath = useLocation().pathname.includes("admin")
  const { admin } = useContext(AppContext)

  return (
    <div>
      
      <Toaster/>

      {!adminPath && <Navbar/> }

      <Routes>
        
        {/* User Routes */}

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

        {/* Admin Routes */}
        <Route path='/admin' element={ admin ? <AdminLayout/> : <AdminLogin/> }>
          <Route index element={ admin ? <Dashboard/> : <AdminLogin/> }/>
          <Route path='add-category' element={ admin ? <AddCategory/> : <AdminLogin/> }/>
          <Route path='add-menu' element={ admin ? <AddMenu/> : <AdminLogin/> }/>
          <Route path='categories' element={ admin ? <Categories/> : <AdminLogin/> }/>
          <Route path='menus' element={ admin ? <Menus/> : <AdminLogin/> }/>
          <Route path='orders' element={ admin ? <Orders/> : <AdminLogin/> }/>
          <Route path='bookings' element={ admin ? <Bookings/> : <AdminLogin/> }/>
        </Route>
      
      </Routes>

      {!adminPath && <Footer/> }

    </div>
  )
}

export default App
