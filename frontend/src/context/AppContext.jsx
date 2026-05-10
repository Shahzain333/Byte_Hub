import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.withCredentials = true

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [categories, setCategories] = useState([])
    const [menus, setMenus] = useState([])
    const [cart, setCart] = useState([])
    const [totalPrice,setTotalPrice] = useState(0)
    const [dataLoading, setDataLoading] = useState(false)

    const isAuth = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get('/api/auth/is-auth')
            if(data.success) {
                setUser(data.user)
                return true
            }
            navigate('/')
            return false
        } catch (error) {
           if (error?.response?.status !== 401) {
                console.log("Error in isAuth App Context", error)
           }
           return false
        } finally {
            setLoading(false)
        }
    }

    const isAdmin = async () => {
        try {
            const { data } = await axios.get('/api/auth/is-admin')
            if(data.success) {
                setAdmin(true)
                return true
            }
            //navigate('/admin')
            return false
        } catch (error) {
           return false
        }
    }

    const fetchCategories = async () => {
        try {
            setDataLoading(true)
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
        } finally {
            setDataLoading(false)
        }
    }

    const fetchMenus = async () => {
        try {
            setDataLoading(true)
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
        } finally {
            setDataLoading(false)
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
            //toast.error(error.response.data.message || "Something went wrong to Add To Cart!")
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

            try {

                const authenticated = await isAuth()
                await isAdmin()

                if (authenticated) {
                    await fetchCart()
                }

                await fetchCategories()
                await fetchMenus()

            } catch (error) {
                console.log("Initialize App Error", error)
            }

        }

        initializeApp()

    }, [])

    const value = { navigate, loading, setLoading, user, setUser, axios, admin, setAdmin,
        categories, fetchCategories, menus, fetchMenus, addToCart, fetchCart, totalPrice, 
        cartCount, cart, dataLoading, isAuth }

    
    return (    
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export default AppContextProvider