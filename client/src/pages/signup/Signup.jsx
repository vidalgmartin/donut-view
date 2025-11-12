import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import './signup.css'
import { serverUrl } from "../../serverUrl"

export default function Signup() {
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)


    const handleSubmit = async (e) => {
        e.preventDefault()

        const username = e.target.username.value.trim()
        const email = e.target.email.value.trim()
        const password = e.target.password.value.trim()
        const confirmPassword = e.target.confirmPassword.value.trim()

        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage("Fields cannot be empty")
            setError(true)
            return
        }

        const validEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return regex.test(email)
        }

        if (!validEmail(email)) {
            setErrorMessage("Please enter a valid email address")
            setError(true)
            return
        }

        if (password != confirmPassword) {
            setErrorMessage("Password does not match")
            setError(true)
            return
        }

        const formData = new FormData()
        formData.append("Username", username)
        formData.append("Email", email)
        formData.append("Password", password)

        try {
            const res = await fetch(`${serverUrl}/api/users`, {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
                let resError = await res.text()
                throw new Error(resError)
            }

            const jwtToken = await res.json()
            const { token } = jwtToken
            login(token)
            navigate("/profile")
        } catch (error) {
            setErrorMessage(error.message)
            setError(true)
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-navigation-btns">
                <Link to="/login"><button id="login-page-btn">Log In</button></Link>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Username:"
                    name="username"
                />

                <input
                    placeholder="Email:"
                    name="email"
                />

                <input
                    placeholder="Password:"
                    name="password"
                />

                <input
                    placeholder="Confirm Password:"
                    name="confirmPassword"
                />
                {error && <p id="input-error">{errorMessage}</p>}

                <button type="submit">Register</button>
            </form>
        </div>
    )
}