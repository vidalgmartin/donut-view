import { useState, useEffect } from "react"
import WorkView from "../../components/WorkView"
import "./community.css"
import { serverUrl } from "../../serverUrl"

export default function Community() {
    const [ allModels, setAllModels ] = useState([])
    const [ selectedModel, setSelectedModel ] = useState({})
    const [ viewModel, setViewModel ] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const handleModelSelection = (model) => {
        setSelectedModel(model)
        setViewModel(true)
    }

    useEffect(() => {
        const getAllModels = async () => {
            const res = await fetch(`${serverUrl}/api/models3d/all`)

            const models = await res.json()
            setAllModels(models)
        }

        getAllModels()
    }, [])

    const filteredModels = allModels.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )

    return (
        <>
            <div className="community-container">
                <div className="community-header-container">
                    <h2>Community Works</h2>

                    <input
                        type="text"
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="community-works-container">
                    {filteredModels.map((model, index) => (
                        <div className="community-work" key={index} onClick={() => handleModelSelection(model)}>
                            <p>{model.name}</p>
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
                        </div>
                    </div>
                </div> 
            )}
        </>
    )
}