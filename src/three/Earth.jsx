import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Earth() {
    const earthRef = useRef();
    const cloudsRef = useRef();
    const starsRef = useRef();

    const [earthMap, earthBump, earthWater, cloudsMap, starsMap] = useTexture([
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe/example/img/earth-topology.png',
        'https://unpkg.com/three-globe/example/img/earth-water.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
        '/milkyway.jpg',
    ]);

  useFrame((_, delta) => {
    // Globus endi aylanmaydi — qat'iy turadi
    // Faqat bulutlar sekin aylanadi
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.02;
});
    return (
        <group>
            {/* YULDUZLAR FONI — Milky Way rasmi, shar ichida */}
            <mesh ref={starsRef} scale={[-1, 1, 1]}>
                <sphereGeometry args={[500, 64, 64]} />
                <meshBasicMaterial
                    map={starsMap}
                    side={THREE.BackSide}
                    color="#b8b8b8"
                />
            </mesh>

            {/* YER */}
            <Sphere ref={earthRef} args={[2, 96, 96]}>
                <meshPhongMaterial
                    map={earthMap}
                    bumpMap={earthBump}
                    bumpScale={0.015}
                    specularMap={earthWater}
                    specular={new THREE.Color('#2a4a6a')}
                    shininess={15}
                />
            </Sphere>

            {/* BULUTLAR */}
            <Sphere ref={cloudsRef} args={[2.008, 72, 72]}>
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                />
            </Sphere>

            {/* ATMOSFERA — nozik feruza nur */}
            <Sphere args={[2.05, 64, 64]}>
                <shaderMaterial
                    uniforms={{ glowColor: { value: new THREE.Color('#4dabff') } }}
                    vertexShader={`
                        varying vec3 vNormal;
                        varying vec3 vPos;
                        void main() {
                            vNormal = normalize(normalMatrix * normal);
                            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                            vPos = mvPos.xyz;
                            gl_Position = projectionMatrix * mvPos;
                        }
                    `}
                    fragmentShader={`
                        uniform vec3 glowColor;
                        varying vec3 vNormal;
                        varying vec3 vPos;
                        void main() {
                            vec3 viewDir = normalize(-vPos);
                            float rim = 1.0 - abs(dot(vNormal, viewDir));
                            float glow = pow(rim, 8.0) * 0.4;
                            gl_FragColor = vec4(glowColor, glow);
                        }
                    `}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>
        </group>
    );
}