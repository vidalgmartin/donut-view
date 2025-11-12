import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import './login.css'
import { serverUrl } from "../../serverUrl"

export default function Login() {
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")
    const { login } = useContext(AuthContext)
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = e.target.email.value.trim()
        const password = e.target.password.value.trim()

        if (!email || !password) {
            setErrorMessage("Fields cannot be empty")
            setError(true)
            return
        }

        const formData = new FormData()
        formData.append("Email", email)
        formData.append("Password", password)

        try {
            const res = await fetch(`${serverUrl}/api/users/login`, {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
                const resError = await res.text()
                throw new Error(resError)
            }

            const jwtToken = await res.json()
            const { token } = jwtToken
            login(token)
            navigate("/profile")
        } catch(error) {
            setErrorMessage(error.message)
            setError(true)
        }
    }

    return (
        <div className="login-container">
            <div className="login-navigation-btns">
                <Link to="/signup"><button id="sign-up-page-btn">Sign Up</button></Link>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Email:"
                    name="email"
                />

                <input
                    type="password"
                    placeholder="Password:"
                    name="password"
                />

                {error && <p id="input-error">{errorMessage}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    )
}