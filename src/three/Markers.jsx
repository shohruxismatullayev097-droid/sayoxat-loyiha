import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { countries } from '../data/countries';

const GLOBE_RADIUS = 2.0;

function latLonToVector3(lat, lon, radius = GLOBE_RADIUS + 0.015) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
         radius * Math.cos(phi),
         radius * Math.sin(phi) * Math.sin(theta)
    );
}

function MarkerPoint({ country, isTarget, onSelect }) {
    const ringRef = useRef();
    const [hovered, setHovered] = useState(false);
    const pos = useMemo(() => latLonToVector3(country.lat, country.lon), [country]);
    const normal = useMemo(() => pos.clone().normalize(), [pos]);

    useFrame(({ clock }) => {
        if (ringRef.current) {
            const t = clock.getElapsedTime() * 2.2 + country.lat * 0.1;
            const scale = 1.0 + Math.sin(t) * 0.4;
            ringRef.current.scale.set(scale, scale, 1);
            ringRef.current.material.opacity = Math.max(0, 0.7 - (scale - 0.7) * 0.8);
        }
    });

    const isUzbekistan = country.id === 'uzbekistan';
    const accentColor = isUzbekistan ? '#06b6d4' : (country.color || '#38bdf8');

    return (
        <group position={pos}>
            <group
                ref={(node) => {
                    if (node) {
                        const target = pos.clone().add(normal);
                        node.lookAt(target);
                    }
                }}
            >
                {/* Outer animated soft pulse ring */}
                <mesh ref={ringRef} position={[0, 0, 0.005]}>
                    <ringGeometry args={[0.025, 0.045, 32]} />
                    <meshBasicMaterial
                        color={accentColor}
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Inner small luminous dot */}
                <mesh
                    position={[0, 0, 0.01]}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(country);
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHovered(true);
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                        setHovered(false);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <circleGeometry args={[hovered ? 0.028 : (isUzbekistan ? 0.022 : 0.016), 24]} />
                    <meshBasicMaterial
                        color={hovered || isTarget ? '#ffffff' : accentColor}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>
            </group>
        </group>
    );
}

export function Markers({ onSelect, targetCountry }) {
    return (
        <group>
            {countries.map((c) => (
                <MarkerPoint
                    key={c.id}
                    country={c}
                    isTarget={targetCountry?.id === c.id}
                    onSelect={onSelect}
                />
            ))}
        </group>
    );
}