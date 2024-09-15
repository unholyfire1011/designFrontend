import React, { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import state from '../store/index.js';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';

const Shirt = () => {

    const snap = useSnapshot(state);
    const [prompt, setPrompt] = useState('');
    const modelRef = useRef();


    const Model = () => {
        const { nodes, materials } = useGLTF('/shirt_baked.glb')
        const material = materials[Object.keys(materials)[0]];

        if (snap.shirtTexture) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(snap.shirtTexture, (texture) => {
                material.map = texture;
                material.needsUpdate = true;
            });
        } else {
            material.map = null;
            material.needsUpdate = true;
        }

        return (
            <group ref={modelRef} dispose={null} scale={7}>
                <mesh geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-color={snap.shirtColor} />
            </group>
        )
    }


    const handleAiClick = async () => {
        try {
            const response = await axios.post('https://designbackend-production.up.railway.app/generate-shirt-image', {
                prompt: prompt
            });
            const asset = response.data.data[0];
            state['shirtTexture'] = asset.asset_url;
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            state['shirtTexture'] = reader.result;
        };
    };



    const handleColorChange = (e) => {
        state['shirtColor'] = e.target.value;
    };

    const handleRemove = () => {
        state['shirtTexture'] = null;
    };
    const handleDownload = () => {
        if (modelRef.current) {
            const exporter = new GLTFExporter();
            exporter.parse(modelRef.current, (result) => {
                const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
                saveAs(blob, 'shirt-model.gltf');
            }, { binary: false });
        }
    };


    return (
        <div className='shirtPage'>
            <div className="shirtPage_buttons">
                <button className='shoePage_Button' onClick={handleDownload}>
                    Download Model
                </button>

                <button className='shoePage_Button' onClick={handleRemove}>
                    Remove Texture
                </button>
                <button className='shoePage_Button' onClick={() => state['currentPage'] = "home"}>
                    Go back
                </button>
            </div>
            <div className="shirtPage_shirtModel">
                <Canvas className="canvas">
                    <Suspense fallback={null}>
                        <ambientLight intensity={1} />
                        <Environment preset="city" />

                        <Model />
                        <OrbitControls
                            enablePan={true}
                            enableZoom={true}
                            minAzimuthAngle={-Math.PI / 4}
                            maxAzimuthAngle={Math.PI / 4}
                            minPolarAngle={Math.PI / 4}
                            maxPolarAngle={Math.PI - Math.PI / 6}

                        />
                    </Suspense>
                </Canvas>
            </div>
            <div className="shirtPage_controls">
                Mesh Color: <input type="color" onChange={handleColorChange} />
                <br />
                <br />

                Texture: <input type="file" onChange={handleFileChange} />
            </div>
            <div className="shirtPage_aiController">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt for AI image generation" />
                <button onClick={handleAiClick}>Generate Image</button>
            </div>
        </div>
    )
}

export default Shirt
