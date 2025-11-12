import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faEdit, faFileLines } from "@fortawesome/free-solid-svg-icons"
import WorkView from "../../components/WorkView"
import './profile.css'
import { serverUrl } from "../../serverUrl"

export default function Profile() {
    const [ userModels, setUserModels ] = useState([])
    const [ viewModel, setViewModel ] = useState(false)
    const [ viewEditProfile, setViewEditProfile ] = useState(false)
    const [ user, setUser ] = useState({})
    const [selectedModel, setSelectedModel ] = useState({})
    const [reportData, setReportData] = useState([])
    const [showReport, setShowReport] = useState(false)

    const fetchReport = async () => {
        const token = localStorage.getItem("token")

        const res = await fetch(`${serverUrl}/api/users/reports/myuploads`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        setReportData(data)
        setShowReport(true)
    }
    
    useEffect(() => {
        getUser()
        getUserModels()
    }, [])

    const handleModelSelection = (model) => {
        setSelectedModel(model)
        setViewModel(true)
    }

    const getUser = async () => {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${serverUrl}/api/users/user`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const user = await res.json()
            setUser(user)
        } catch (error) {
            console.error(error)
        }
    }

    const getUserModels = async () => {
        const token = localStorage.getItem("token")
        
        try {
            const res = await fetch(`${serverUrl}/api/models3d/user`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const models = await res.json()
            setUserModels(models)
        } catch (error) {
            console.error(error)
        }
    }

    const updateUser = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")

        try {
            const formData = new FormData()
            formData.append("Title", e.target.title.value.trim())
            formData.append("Description", e.target.description.value.trim())

            const res = await fetch(`${serverUrl}/api/users/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            if (res.ok) {
                setViewEditProfile(false)
                getUser()
            }
        } catch (error) {
            console.error(error)
        }  
    }

    const deleteModel = async () => {
        const confirmed = confirm("Proceed to delete this model?")
        if (!confirmed) {
            return
        }

        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${serverUrl}/${selectedModel.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.ok) {
                setViewModel(false)

                // remove model from state
                setUserModels(prev => prev.filter(m => m.id !== selectedModel.id))
            } else {
                console.error("Failed to delete model")
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <>
            <div className="profile-container">

                <div className="profile-header-container">
                    <div className="profile-details">      
                        <div className="profile-headers">
                            <h2>{user.username}</h2>
                            <h3>{user.title}</h3>
                        </div>              

                        <p>{user.description}</p>
                    </div>

                    <div className="profile-btns">
                        <FontAwesomeIcon icon={faEdit} id="edit-icon" onClick={() => setViewEditProfile(true)} title="Edit Profile"/>

                        <FontAwesomeIcon icon={faFileLines} id="report-icon" onClick={fetchReport} title="Generate Report"/>
                        
                        <Link to="/work-upload"><FontAwesomeIcon icon={faUpload} id="upload-icon" title="Upload Model"/></Link>
                    </div>
                </div>

                <div className="profile-work-container">
                    {userModels.map((model, index) => (
                        <div className="profile-work-item" key={index} onClick={() => handleModelSelection(model)}>
                            <p onClick={() => setViewModel(true)}>{model.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {viewModel && (
                <div className="work-view-overlay" onClick={() => setViewModel(false)}>
                    <div className="work-view-content" onClick={(e) => e.stopPropagation()}>
                        <div className="work-view-container">
                            <WorkView modelId={selectedModel.id} />
                        </div>

                        <div className="work-view-details">
                            <div className="work-view-details-text">
                                <h2>{selectedModel.name}</h2>
                                <p>{selectedModel.description}</p>
                            </div>

                            <button onClick={deleteModel}>X</button>
                        </div>
                    </div>
                </div> 
            )}

            {viewEditProfile && (
                <div className="edit-profile-overlay">
                    <div className="edit-profile-content">

                        <div id="edit-profile-cancel-btn">
                            <button onClick={() => setViewEditProfile(false)}>Cancel</button>
                        </div>

                        <h3>Edit Profile</h3>

                        <form className="edit-profile-form" onSubmit={updateUser}>
                            <input 
                                type="text" 
                                name="title"
                                placeholder="Title:"
                                maxLength="50"
                                defaultValue={user.title}
                            />
                            <textarea 
                                name="description"
                                placeholder="Profile Description" 
                                
                                maxLength="200"
                                rows={4} 
                                defaultValue={user.description}
                            />
                            <button type="submit">Save</button>
                        </form>

                    </div>
                </div>
            )}

            {showReport && (
                <div className="report-container">
                    <div className="report-btn-container">
                        <button onClick={() => setShowReport(false)}>Close</button>
                    </div>

                    <div>
                        <h3>Your 3D Model Upload Report</h3>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Upload Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}