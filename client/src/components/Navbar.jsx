import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext)
    const [ menuView, setMenuView ] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const logoutClick = () => {
        logout()
        navigate("/")
    }

    useEffect(() => {
        setMenuView(false)
    }, [location.pathname])    
    
    return (
        <div className="navbar-container">
            <div className="navbar-items">
                <Link to="/" id="logo"><h2>Donut View</h2></Link>
                
                <div className="menu-wrapper">
                    <FontAwesomeIcon
                        icon={faBars}
                        id="menu-icon"
                        onClick={() => setMenuView(prev => !prev)}
                    />

                    {menuView && (
                        <div className="dropdown-menu">
                            {isAuthenticated ? (
                                <Link to="/profile">Profile</Link>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                            
                            <Link to="/community">Community</Link>

                            {isAuthenticated && (
                                <a onClick={() => logoutClick()}>Logout</a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}