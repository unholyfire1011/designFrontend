import React, { useRef, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { saveAs } from 'file-saver';
import state from '../store/index.js';
import * as THREE from 'three';
import axios from 'axios';


const ShoeComponent = () => {
    const snap = useSnapshot(state, { sync: true });
    const modelRef = useRef();
    const canvasRef = useRef();
    const [prompt, setPrompt] = useState('');

    const Model = () => {
        const { nodes, materials } = useGLTF('/shoe.gltf');
        materials.laces.color.set(snap.lace);
        materials.mesh.color.set(snap.mesh);
        materials.caps.color.set(snap.caps);
        materials.inner.color.set(snap.inner);
        materials.sole.color.set(snap.sole);
        materials.stripes.color.set(snap.stripes);
        materials.band.color.set(snap.band);
        materials.patch.color.set(snap.patch);

        if (snap.meshTexture) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(snap.meshTexture, (texture) => {
                materials.mesh.map = texture;
                materials.mesh.needsUpdate = true;
            });
        } else {
            materials.mesh.map = null;
            materials.mesh.needsUpdate = true;
        }

        return (
            <group ref={modelRef} dispose={null} scale={3}>
                <mesh geometry={nodes.shoe.geometry} material={materials.laces} />
                <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} />
                <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} />
                <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} />
                <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} />
                <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} />
                <mesh geometry={nodes.shoe_6.geometry} material={materials.band} />
                <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} />
            </group>
        );
    };

    const handleDownload = () => {
        if (modelRef.current) {
            const exporter = new GLTFExporter();
            exporter.parse(modelRef.current, (result) => {
                const blob = new Blob([JSON.stringify(result)], { type: 'application/json' });
                saveAs(blob, 'shoe-model.gltf');
            }, { binary: false });
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            state['meshTexture'] = reader.result;
        };
    };

    const handleColorChange = (part) => (e) => {
        state[part] = e.target.value;
    };

    const handleRemove = () => {
        state['meshTexture'] = null;
    };

    const handleAiClick = async () => {
        try {
            const response = await axios.post('https://designbackend-production.up.railway.app/generate-image', {
                prompt: prompt
            });
            const asset = response.data.data[0];
            state['meshTexture'] = asset.asset_url;
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div className='shoePage'>
            <div className="shoePage_buttons">
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
            <div className="shoePage_shoeModel" ref={canvasRef}>
                <Canvas>
                    <Suspense fallback={null}>
                        <ambientLight />
                        <spotLight
                            intensity={0.9}
                            angle={0.1}
                            penumbra={1}
                            position={[10, 15, 10]}
                            castShadow
                        />
                        <Model />
                        <OrbitControls
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                        />
                    </Suspense>
                </Canvas>
            </div>
            <div className="shoePage_Color_controls">
                {['lace', 'mesh', 'caps', 'inner', 'sole', 'stripes', 'band', 'patch'].map(part => (
                    <div key={part}>
                        {`${part.charAt(0).toUpperCase() + part.slice(1)} Color: `}
                        <input type="color" value={snap[part]} onChange={handleColorChange(part)} />
                    </div>
                ))}
            </div>
            <div className="shoePage_texture_controls">
                <div>
                    Mesh Texture: <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
            <div className="shoePage_aiController">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt for AI image generation" />
                <button onClick={handleAiClick}>Generate Image</button>
            </div>
        </div>
    );
}

export default ShoeComponent;