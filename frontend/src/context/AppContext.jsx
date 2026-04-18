import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.withCredentials = true

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(null)
    const value = { navigate, loading, setLoading, user, setUser, axios, admin, setAdmin }

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

    useEffect(() => {
        isAuth
    }, [])
    
    return (    
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export default AppContextProvider