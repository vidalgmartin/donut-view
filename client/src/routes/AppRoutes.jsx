import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Home from '../pages/home/Home'
import Login from '../pages/login/Login'
import Signup from '../pages/signup/Signup'
import Profile from '../pages/profile/Profile'
import WorkUpload from '../pages/work/WorkUpload'
import Community from '../pages/community/Community'

export default function AppRoutes() {
    const { isAuthenticated } = useContext(AuthContext)

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Community /> : <Home />} />
            <Route path="/login" element={isAuthenticated ? <Profile /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Profile /> : <Signup />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path ="/work-upload" element={isAuthenticated ? <WorkUpload /> : <Navigate to="/login" />} />
            <Route path ="/community" element={<Community />} />
        </Routes>
    )
}