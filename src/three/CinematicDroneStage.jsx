import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const PLANE_Z = -5.5;
const SEGMENTS = 128;

const vertexShader = /* glsl */ `
  uniform float uWarp;
  uniform float uDepthStrength;
  uniform sampler2D uDepthCurr;
  uniform sampler2D uDepthNext;
  uniform float uHasDepthCurr;
  uniform float uHasDepthNext;
  uniform float uTransition;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Sample clean grayscale depth
    float dCurr = dot(texture2D(uDepthCurr, uv).rgb, vec3(0.299, 0.587, 0.114)) * uHasDepthCurr;
    float dNext = dot(texture2D(uDepthNext, uv).rgb, vec3(0.299, 0.587, 0.114)) * uHasDepthNext;
    float d = mix(dCurr, dNext, uTransition);
    vDepth = d;

    // Direct uniform displacement — architectural columns and minarets stay 100% vertical & rigid
    pos.z += d * uDepthStrength;

    // Dynamic motion warp during drone flight transition
    vec2 centered = (uv - 0.5) * 2.0;
    float dist = length(centered);
    pos.z += pow(dist, 2.0) * uWarp * 1.4;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexCurr;
  uniform sampler2D uTexNext;
  uniform float uTransition;
  uniform float uWarp;
  uniform float uTime;

  varying vec2 vUv;
  varying float vDepth;

  vec4 sampleSpeedStreak(sampler2D tex, vec2 uv, float warp) {
    if (warp < 0.01) return texture2D(tex, uv);
    vec2 center = vec2(0.5, 0.45);
    vec2 dir = uv - center;
    vec4 col = vec4(0.0);
    for (int i = 0; i < 6; i++) {
        float factor = 1.0 - warp * 0.045 * float(i);
        vec2 sampleUv = center + dir * factor;
        sampleUv = clamp(sampleUv, 0.002, 0.998);
        col += texture2D(tex, sampleUv);
    }
    return col / 6.0;
  }

  void main() {
    vec2 uv = vUv;

    // Radial zoom streak on current and incoming scene
    vec4 cCurr = sampleSpeedStreak(uTexCurr, uv, uWarp);
    vec4 cNext = sampleSpeedStreak(uTexNext, uv, (1.0 - uTransition) * uWarp);

    // Smooth cinematic dissolve
    float blend = smoothstep(0.0, 1.0, uTransition);
    vec4 finalCol = mix(cCurr, cNext, blend);

    // Cinematic anamorphic lens flare / atmospheric speed glow
    if (uWarp > 0.02) {
        vec2 centered = (uv - 0.5) * 2.0;
        float flare = max(0.0, 1.0 - length(centered * vec2(1.0, 1.6))) * uWarp * 0.45;
        finalCol.rgb += vec3(1.0, 0.88, 0.65) * flare;
    }

    // High-end cinematic vignette
    vec2 vUvCentered = (uv - 0.5) * 2.0;
    float vig = 1.0 - dot(vUvCentered, vUvCentered) * 0.18;
    finalCol.rgb *= clamp(vig, 0.0, 1.0);

    gl_FragColor = finalCol;
  }
`;

function FlightPlane({ scenes, progressRef }) {
    const materialRef = useRef();

    // Load all textures once
    const colorUrls = useMemo(() => scenes.map((s) => s.image), [scenes]);
    const depthUrls = useMemo(() => scenes.map((s) => s.depth || s.image), [scenes]);

    const textures = useLoader(THREE.TextureLoader, colorUrls);
    const depthMaps = useLoader(THREE.TextureLoader, depthUrls);

    useEffect(() => {
        textures.forEach((t) => {
            if (t) t.colorSpace = THREE.SRGBColorSpace;
        });
    }, [textures]);

    // Plane geometry is slightly oversized so no border is ever visible
    const geometry = useMemo(() => new THREE.PlaneGeometry(18.5, 10.4, SEGMENTS, SEGMENTS), []);

    const initialUniforms = useMemo(
        () => ({
            uTexCurr: { value: textures[0] },
            uTexNext: { value: textures[1] || textures[0] },
            uDepthCurr: { value: depthMaps[0] },
            uDepthNext: { value: depthMaps[1] || depthMaps[0] },
            uHasDepthCurr: { value: scenes[0]?.depth ? 1.0 : 0.0 },
            uHasDepthNext: { value: scenes[1]?.depth ? 1.0 : 0.0 },
            uTransition: { value: 0.0 },
            uWarp: { value: 0.0 },
            uDepthStrength: { value: 0.75 },
            uTime: { value: 0 },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useFrame(({ camera, clock }) => {
        const p = Math.min(Math.max(progressRef.current || 0, 0), 0.9999);
        const count = scenes.length;
        const segSize = 1.0 / count;

        const currIdx = Math.min(Math.floor(p / segSize), count - 1);
        const nextIdx = Math.min(currIdx + 1, count - 1);
        const localP = (p - currIdx * segSize) / segSize;

        // Transition zone in the last 30% of each city flight
        let transition = 0.0;
        let warp = 0.0;
        let flightZ = 0.0;
        let flightY = 0.0;

        if (currIdx === count - 1) {
            flightZ = 8.5 - localP * 3.5;
            flightY = 0.5 - localP * 0.4;
            transition = 0.0;
            warp = 0.0;
        } else if (localP < 0.7) {
            const inFlight = localP / 0.7;
            flightZ = 8.5 - inFlight * 3.2;
            flightY = 0.6 - inFlight * 0.5;
            transition = 0.0;
            warp = 0.0;
        } else {
            const transP = (localP - 0.7) / 0.3;
            transition = transP;
            warp = Math.sin(transP * Math.PI) * 1.0;
            flightZ = 8.5 - 3.2 - transP * 2.2;
            flightY = 0.1 + Math.sin(transP * Math.PI) * 0.4;
        }

        if (materialRef.current) {
            const u = materialRef.current.uniforms;
            u.uTexCurr.value = textures[currIdx];
            u.uTexNext.value = textures[nextIdx];
            u.uDepthCurr.value = depthMaps[currIdx];
            u.uDepthNext.value = depthMaps[nextIdx];
            u.uHasDepthCurr.value = scenes[currIdx]?.depth ? 1.0 : 0.0;
            u.uHasDepthNext.value = scenes[nextIdx]?.depth ? 1.0 : 0.0;
            u.uTransition.value = transition;
            u.uWarp.value = warp;
            u.uTime.value = clock.getElapsedTime();
        }

        // Position camera: steady forward flight, locked roll, straight minarets
        const swayX = Math.sin(localP * Math.PI) * 0.03;
        camera.position.set(swayX, flightY, PLANE_Z + flightZ);
        camera.lookAt(0, -0.15, PLANE_Z);
    });

    return (
        <mesh geometry={geometry} position={[0, 0, PLANE_Z]}>
            <shaderMaterial
                ref={materialRef}
                uniforms={initialUniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
}

export function CinematicDroneStage({ scenes, progressRef }) {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#020308', overflow: 'hidden' }}>
            <Canvas
                camera={{ position: [0, 0.6, PLANE_Z + 8.5], fov: 48, near: 0.1, far: 80 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                <FlightPlane scenes={scenes} progressRef={progressRef} />
            </Canvas>
        </div>
    );
}
