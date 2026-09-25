import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Earth } from '../../three/Earth';
import { Markers } from '../../three/Markers';
import { CameraController } from '../../three/CameraController';
import styles from './Globe.module.css';

export function Globe({ targetCountry, onSelect }) {
    return (
        <div className={styles.globeWrap}>
            <Canvas
                camera={{ position: [1.4, 1.8, -3.8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]}
            >
                <Suspense fallback={null}>
                    {/* Primary warm sunlight illuminating Central Asia & Silk Road */}
                    <directionalLight
                        position={[3, 4, -4]}
                        intensity={2.8}
                        color="#fff9ea"
                    />
                    <ambientLight intensity={0.5} />
                    {/* Deep space blue rim backlight */}
                    <directionalLight
                        position={[-4, -2, 3]}
                        intensity={0.8}
                        color="#7db5ff"
                    />

                    <Earth />
                    <Markers onSelect={onSelect} targetCountry={targetCountry} />
                    <CameraController targetCountry={targetCountry} />
                </Suspense>
            </Canvas>
        </div>
    );
}