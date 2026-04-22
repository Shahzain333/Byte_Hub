import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.withCredentials = true

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [categories, setCategories] = useState([])

    const isAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/is-auth')
            if(data.success) {
                setUser(data.user)
            }
        } catch (error) {
           console.log("Error in isAuth App Context", error)   
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

    useEffect(() => {
        isAuth(),
        fetchCategories()
    }, [])

    const value = { navigate, loading, setLoading, user, setUser, axios, admin, setAdmin,
        categories, fetchCategories }

    
    return (    
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export default AppContextProvider