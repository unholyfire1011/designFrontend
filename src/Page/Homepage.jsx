import React, { Suspense } from 'react'
import three from '../assets/threejs.png'
import state from '../store'
import { useSnapshot } from 'valtio'
import { Canvas } from '@react-three/fiber';
import {  useGLTF } from '@react-three/drei';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const Homepage = () => {

    const snap = useSnapshot(state);
    const ShirtModel = () => {
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
            <group dispose={null} scale={8}>
                <mesh geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-color={snap.shirtColor} />
            </group>
        )
    }
    const ShoeModel = () => {
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
            <group dispose={null} scale={3}>
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
    }


    return (
        <div className='HomePage'>
            <div className="Homepage_content">
                <div className="Homepage_content_logo">
                    <img src={three} alt="" />
                </div>
                <div className="Homepage_content_heading">
                    <h1>Dimension3D</h1>
                    <h3>Click on a object to animate ➔</h3>
                </div>

            </div>
            <div className="Homepage_models">
                <div className="Homepage_models_shirt" onClick={() => state['currentPage'] = "shirt"}>
                    <Canvas>
                        <Suspense fallback={null}>
                            <ambientLight intensity={1} />
                            <Environment preset="city" />

                            <ShirtModel />

                        </Suspense>
                    </Canvas>
                </div>
                <div className="Homepage_models_shoes" onClick={() => state['currentPage'] = "shoe"}>
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
                            <ShoeModel />

                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

export default Homepage
