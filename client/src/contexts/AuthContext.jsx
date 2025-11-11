import { jwtDecode } from "jwt-decode"
import { createContext, useState, useEffect} from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decoded = jwtDecode(token)
                const currentTime = Date.now() / 1000

                if (decoded.exp && decoded.exp > currentTime) {
                    setIsAuthenticated(true)
                    setUser(decoded)
                } else {
                    localStorage.removeItem("token")
                }
            } catch (error) {
                console.error("Invalid token: ", error)
                localStorage.removeItem("token")
            }
        }

        setLoading(false)
    }, [])

    const login = (token) => {
        localStorage.setItem("token", token)
        const decoded = jwtDecode(token)
        setIsAuthenticated(true)
        setUser(decoded)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setIsAuthenticated(false)
        setUser(null)
    }

    // wait for app to load context before displaying components
    // to prevent false page view restrictions
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}