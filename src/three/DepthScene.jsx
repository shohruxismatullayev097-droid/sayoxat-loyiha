import { Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Vertex shader: depth-map asosida vertekslarni suradi.
 * - avval kichik blur bilan tekislaydi (shovqin kamayadi)
 * - rasm CHETLARIDA effektni asta-sekin kuchsizlantiradi (edge feather),
 *   shu bois chekka ustunlar "bo'rtib" ketmaydi
 */
const vertexShader = /* glsl */ `
  uniform sampler2D depthMap;
  uniform vec2 depthTexel;
  uniform float depthStrength;
  uniform float hasDepth;
  uniform float depthInvert;
  varying vec2 vUv;

  float sampleDepth(vec2 uv) {
    float d = texture2D(depthMap, uv).r * 4.0;
    d += texture2D(depthMap, uv + vec2(depthTexel.x, 0.0)).r;
    d += texture2D(depthMap, uv - vec2(depthTexel.x, 0.0)).r;
    d += texture2D(depthMap, uv + vec2(0.0, depthTexel.y)).r;
    d += texture2D(depthMap, uv - vec2(0.0, depthTexel.y)).r;
    return d / 8.0;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float raw = sampleDepth(uv);
    float d = mix(raw, 1.0 - raw, depthInvert);

    // Eng "yaqin" (eng yorqin) qiymatlarni kesib qo'yamiz — masalan, hovli
    // poli yoki chiroqlar cheksiz oldinga surilib ketmasligi uchun.
    d = min(d, 0.72);

    // Chap/o'ng va yuqori chekka — 16% da yumshaydi.
    float fadeX = smoothstep(0.0, 0.16, uv.x) * smoothstep(0.0, 0.16, 1.0 - uv.x);
    float fadeTop = smoothstep(0.0, 0.16, 1.0 - uv.y);
    // Pastki chekka (yer/hovli) — 32% da, ya'ni ikki barobar kengroq maydonda yumshaydi,
    // chunki aynan shu hudud eng ko'p buzilishga moyil.
    float fadeBottom = smoothstep(0.0, 0.32, uv.y);
    float edgeFade = fadeX * fadeTop * fadeBottom;

    pos.z += d * depthStrength * hasDepth * edgeFade;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D colorMap;
  uniform vec3 fogColor;
  uniform float fogNear;
  uniform float fogFar;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(colorMap, vUv);

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    vec3 color = mix(tex.rgb, fogColor, fogFactor * 0.3);

    gl_FragColor = vec4(color, tex.a);
  }
`;

// ============ SOZLANADIGAN PARAMETRLAR ============
const PLANE_Z = -6;
const DOLLY_START = 9;
const DOLLY_END = 3.2;          // avval 2.6 edi — endi biroz uzoqroqda to'xtaydi, chetlar kamroq buziladi
const FOV_START = 50;
const FOV_MAX_DELTA = 3;        // avval 6 edi — yumshoqroq
const X_DRIFT = 0.15;           // avval 0.55 edi — yon tebranish kamaytirildi (chetdagi shear kamayadi)
const DEFAULT_DEPTH_STRENGTH = 0.85;
const SEGMENTS = 128;           // avval 220 edi — vertekslar soni ~3 barobar kamaydi -> performance yaxshilanadi

function DroneFlight({ colorUrl, depthUrl, progressRef, depthStrength = DEFAULT_DEPTH_STRENGTH, depthInvert = false }) {
    const colorMap = useLoader(THREE.TextureLoader, colorUrl);
    const depthMap = useLoader(THREE.TextureLoader, depthUrl || colorUrl);

    const hasDepth = Boolean(depthUrl);
    const dw = depthMap.image?.width || 1024;
    const dh = depthMap.image?.height || 1024;
    const geometry = useMemo(() => new THREE.PlaneGeometry(16, 9, SEGMENTS, SEGMENTS), []);
    const uniforms = useMemo(
        () => ({
            colorMap: { value: colorMap },
            depthMap: { value: depthMap },
            depthTexel: { value: new THREE.Vector2(1 / dw, 1 / dh) },
            depthStrength: { value: depthStrength },
            hasDepth: { value: hasDepth ? 1 : 0 },
            depthInvert: { value: depthInvert ? 1 : 0 },
            fogColor: { value: new THREE.Color('#020308') },
            fogNear: { value: 0.85 },
            fogFar: { value: 0.995 },
        }),
        [colorMap, depthMap, dw, dh, depthStrength, hasDepth, depthInvert]
    );

    useFrame(({ camera }) => {
        const p = progressRef?.current ?? 0;

        camera.position.z = PLANE_Z + DOLLY_START - p * (DOLLY_START - DOLLY_END);
        camera.position.y = 1.2 - p * 0.9 + Math.sin(p * Math.PI * 2) * 0.05;
        camera.position.x = Math.sin(p * Math.PI * 1.3) * X_DRIFT;

        camera.fov = FOV_START + p * FOV_MAX_DELTA;
        camera.updateProjectionMatrix();

        camera.lookAt(camera.position.x * 0.35, -p * 0.5, PLANE_Z);
    });

    return (
        <mesh geometry={geometry} position={[0, 0, PLANE_Z]}>
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </mesh>
    );
}

export function DepthScene({ colorUrl, depthUrl, progressRef, depthStrength, depthInvert, active = true }) {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#020308' }}>
            <Canvas
                camera={{ position: [0, 1.2, PLANE_Z + DOLLY_START], fov: FOV_START, near: 0.1, far: 100 }}
                gl={{ antialias: true }}
                dpr={[1, 2]}
                frameloop={active ? 'always' : 'never'}
            >
                <Suspense fallback={null}>
                    <DroneFlight
                        colorUrl={colorUrl}
                        depthUrl={depthUrl}
                        progressRef={progressRef}
                        depthStrength={depthStrength}
                        depthInvert={depthInvert}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}