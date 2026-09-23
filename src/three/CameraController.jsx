import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DEFAULT_DIST = 4.5;
const COUNTRY_DIST = 2.38; // Orbital descent close to the atmosphere
const DURATION = 4.2;

function latLonToDirection(lat, lon) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -Math.sin(phi) * Math.cos(theta),
         Math.cos(phi),
         Math.sin(phi) * Math.sin(theta)
    ).normalize();
}

function dirToSpherical(v) {
    const phi = Math.acos(Math.max(-1, Math.min(1, v.y)));
    const theta = Math.atan2(v.z, v.x);
    return { phi, theta };
}

function sphericalToDir(phi, theta) {
    return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
    );
}

function lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return a + diff * t;
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function CameraController({ targetCountry }) {
    const controlsRef = useRef();
    const { camera } = useThree();

    const animating = useRef(false);
    const startDir = useRef(new THREE.Vector3());
    const endDir = useRef(new THREE.Vector3());
    const startDist = useRef(0);
    const endDist = useRef(0);
    const t = useRef(0);

    useEffect(() => {
        startDir.current.copy(camera.position).normalize();
        startDist.current = camera.position.length();

        if (targetCountry) {
            endDir.current.copy(
                latLonToDirection(targetCountry.lat, targetCountry.lon)
            );
            endDist.current = COUNTRY_DIST;
        } else {
            // Default look towards Eurasia & Silk Road
            endDir.current.copy(latLonToDirection(32, 64));
            endDist.current = DEFAULT_DIST;
        }

        t.current = 0;
        animating.current = true;
    }, [targetCountry, camera]);

    useFrame((_, delta) => {
        if (controlsRef.current) {
            controlsRef.current.enabled = !animating.current;
            controlsRef.current.autoRotate = !targetCountry && !animating.current;
        }

        if (!animating.current) return;

        t.current = Math.min(t.current + delta / DURATION, 1);
        const eased = easeInOut(t.current);

        const startSph = dirToSpherical(startDir.current);
        const endSph = dirToSpherical(endDir.current);

        const phi = startSph.phi + (endSph.phi - startSph.phi) * eased;
        const theta = lerpAngle(startSph.theta, endSph.theta, eased);
        const dir = sphericalToDir(phi, theta);

        const dist = startDist.current + (endDist.current - startDist.current) * eased;

        camera.position.copy(dir.multiplyScalar(dist));
        camera.lookAt(0, 0, 0);

        if (t.current >= 1) {
            animating.current = false;
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.4}
            autoRotateSpeed={0.4}
        />
    );
}