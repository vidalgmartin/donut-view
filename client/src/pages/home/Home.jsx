import { Link } from "react-router-dom"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import './home.css'

function Donut() {
    const ref = useRef()

    useFrame(() => {
        ref.current.rotation.z += 0.0005;
    })

    return (
        <mesh ref={ref} position={[0, 0, -15]} rotation={[2, 0.4, 0]}>
            <torusGeometry args={[10, 3, 16, 60]}/>
            <meshStandardMaterial wireframe color="white" />
        </mesh>
    )
}

export default function Home() {

    return (
        <div className="home-container">

            <div className="home-content-container">
            
                <div className="home-content" id="donut-container">
                    <Canvas camera={{ position: [-0.4, 1, 6] }}>
                        <ambientLight />
                        <Donut />
                    </Canvas>
                </div>

                <div className="home-content home-section">
                    <div className="home-text">
                        <h2>Store, share and view</h2>
                        <h2>3D art</h2>
                    </div>
                            
                    
                    <div className="home-btns">
                        <Link to="/signup">
                            <button>
                                Sign Up
                            </button>
                        </Link>

                        <Link to="/login">Already have an account?</Link>
                    </div>
                </div>

            </div>

      </div>
    )
}