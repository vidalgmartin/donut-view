import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { serverUrl } from "../serverUrl"

function Model({ url }) {
    const gltf = useGLTF(url)
    return <primitive object={gltf.scene} />
}

export default function WorkView({ modelId }) {
    const [blobUrl, setBlobUrl] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        
        const fetchModel = async () => {
            const res = await fetch(`${serverUrl}/api/models3d/${modelId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            setBlobUrl(url)  

            // dispose of blob url once done
            return () => URL.revokeObjectURL(url)
        };

        fetchModel()
    }, [modelId])

    return (
        <>
            {!blobUrl ? (
                <p>Loading model...</p>
            ) : (
                <Canvas camera={{ position: [0, 2, 4] }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <Model url={blobUrl} />
                    <OrbitControls />
                </Canvas>
            )}
        </>
    )
}