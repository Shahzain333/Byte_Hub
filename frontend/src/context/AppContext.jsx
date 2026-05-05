import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.withCredentials = true

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [categories, setCategories] = useState([])
    const [menus, setMenus] = useState([])
    const [cart, setCart] = useState([])
    const [totalPrice,setTotalPrice] = useState(0)

    const isAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/is-auth')
            if(data.success) {
                setUser(data.user)
                return true
            }
            return false
        } catch (error) {
           if (error?.response?.status !== 401) {
                console.log("Error in isAuth App Context", error)
           }
           return false
        }
    }

    const fetchCategories = async () => {
        try {
            
            const { data } = await axios.get('/api/category/all')
            //console.log("Data", data)
            if(data.success) {
                setCategories(data.categories)
            } else {
                //toast.error(data.message)
                console.log("Failed to fetch categories")
            }

        } catch (error) {
            // toast.error(error.response.data.message || "Something went wrong!")
            console.log("Error in Frontend AppContext fetch Categories", error)
        }
    }

    const fetchMenus = async () => {
        try {
            
            const { data } = await axios.get('/api/menu/all')
            //console.log("Data", data)
            if(data.success) {
                setMenus(data.menuItems)
            } else {
                //toast.error(data.message)
                console.log("Failed to fetch categories")
            }

        } catch (error) {
            // toast.error(error.response.data.message || "Something went wrong!")
            console.log("Error in Frontend AppContext fetch Menus", error)
        }
    }

    const addToCart = async (menuItemId) => {
        try {
            
            const { data } = await axios.post(`/api/cart/add`, {
                menuItemId, 
                quantity: 1
            })
            //console.log("Data", data)
            if(data.success) {
                toast.success(data.message)
                await fetchCart()
            } else {
                toast.error(data.message)
                console.log("Failed to Add To Cart")
            }

        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong to Add To Cart!")
            console.log("Error in Frontend AppContext addToCart", error)
        }
    }

    const fetchCart = async () => {
        try {
            
            const { data } = await axios.get(`/api/cart/get`)
            //console.log("Data", data)
            
            if(data.success) {
                //toast.success("")
                setCart(data.cart)
                //setTotalPrice(data.totalPrice)
            } else {
                //toast.error(data.message)
                console.log("Failed to Fetch Cart")
            }

        } catch (error) {
            if (error?.response?.status !== 401) {
                toast.error(error.response?.data?.message || "Something went wrong to Fetch Cart!")
            }
            console.log("Error in Frontend AppContext Fetch Cart", error)
        }
    }

    const cartCount = useMemo(() => {
        return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
    }, [cart])

    useEffect(() => {
        if(cart?.items) {
            const total = cart?.items?.reduce((acc,item) => acc + item.menuItem.price * item.quantity, 0)
            setTotalPrice(total)
        }
    }, [cart])

    useEffect(() => {
        const initializeApp = async () => {

            const authenticated = await isAuth()
            
            fetchCategories()
            fetchMenus()
            
            if (authenticated) {
                fetchCart()
            }
        
        }
        
        initializeApp()

    }, [])

    const value = { navigate, loading, setLoading, user, setUser, axios, admin, setAdmin,
        categories, fetchCategories, menus, fetchMenus, addToCart, fetchCart, totalPrice, cartCount, cart }

    
    return (    
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export default AppContextProvider