import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './work.css'
import { serverUrl } from "../../serverUrl"

export default function WorkUpload() {
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const name = e.target.name.value.trim()
        const file = e.target.file.files[0]
        const description = e.target.description.value.trim()
        
        const formData = new FormData()
        formData.append("Name", name)
        formData.append("File", file)
        formData.append("Description", description)

        if (!name) {
            setErrorMessage("Name cannot be left empty")
            setError(true)
            return
        }

        if (!file) {
            setErrorMessage("File cannot be left empty")
            setError(true)
            return
        }

        try {
            const token = localStorage.getItem("token")
            
            const res = await fetch(`${serverUrl}/api/models3d`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const resError = await res.text()
                throw new Error(resError)
            }

            navigate(-1)
        } catch (error) {
            setErrorMessage(error.message)
            setError(true)
        }
    }

    return (
        <div className="wu-container">
            <div className="wu-navigation-container">
                <Link to="/profile"><button id="wu-back-btn">Cancel</button></Link>
            </div>

            <form className="wu-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Name:"
                    name="name"
                    maxLength={25}
                />

                <textarea
                    placeholder="Description (Optional):"
                    name="description"
                    maxLength="150"
                    rows={4}
                />

                <label id="wu-file-input-label">(currently only supports .glb files)</label>
                <input
                    type="file"
                    name="file"
                    accept=".glb"
                    id="wu-file-input"
                />
                {error && <p id="input-error">{errorMessage}</p>}

                <div className="wu-form-btn-container">
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}