import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicDroneStage } from '../../three/CinematicDroneStage';
import { WeatherParticles } from '../../components/WeatherParticles/WeatherParticles';
import { soundscape } from '../../utils/soundscape';
import styles from './SceneScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

export function SceneScroll({ scenes }) {
    const containerRef = useRef();
    const progressRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.0,
            onUpdate: (self) => {
                const p = self.progress;
                progressRef.current = p;

                const count = scenes.length;
                const segSize = 1.0 / count;
                const idx = Math.min(Math.floor(p / segSize), count - 1);
                const localP = (p - idx * segSize) / segSize;

                const transitioning = localP > 0.7 && idx < count - 1;
                setActiveIdx(idx);
                setIsTransitioning(transitioning);

                // Manzilga qarab tovush o'zgartirish
                soundscape.setSpeedFlight(transitioning ? 1.0 : 0.0);
                if (scenes[idx]) {
                    soundscape.setLocationWeather(scenes[idx].id);
                }
            },
        });

        return () => trigger.kill();
    }, [scenes]);

    const activeScene = scenes[activeIdx] || scenes[0];
    const nextScene = scenes[activeIdx + 1];

    return (
        <div ref={containerRef} className={styles.flightContainer}>
            <div className={styles.stageWrap}>
                {/* 3D WebGL Unified Drone Stage */}
                <CinematicDroneStage scenes={scenes} progressRef={progressRef} />

                {/* Real-time Atmospheric Climate & Weather Particles */}
                <WeatherParticles type={activeScene.weather?.particleType || 'fireflies'} />

                {/* Subtle Cinematic Vignette */}
                <div className={styles.cinematicShade} />

                {/* Minimal Route Progress Dots (top) */}
                <div className={styles.routeDotsWrap}>
                    {scenes.map((s, i) => (
                        <div
                            key={s.id}
                            className={`${styles.routeDot} ${i === activeIdx ? styles.activeDot : ''} ${i < activeIdx ? styles.passedDot : ''}`}
                            title={s.title.uz}
                        />
                    ))}
                </div>

                {/* Center / Bottom Cinematic Location Card */}
                <div className={styles.contentWrap}>
                    {isTransitioning && nextScene && (
                        <div className={styles.warpAlert}>
                            <span>{nextScene.title.uz} sari uchilmoqda...</span>
                        </div>
                    )}

                    <div className={styles.titleCard} key={activeScene.id}>
                        <span className={styles.stepNum}>
                            {String(activeIdx + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
                        </span>
                        <h2 className={styles.titleText}>{activeScene.title.uz}</h2>
                        <p className={styles.subtitleText}>{activeScene.subtitle.uz}</p>

                        {/* Ob-havo belgisi (faqat ikonka va harorat) */}
                        {activeScene.weather && (
                            <div className={styles.weatherMini}>
                                <span>{activeScene.weather.icon}</span>
                                <span>{activeScene.weather.temp}</span>
                                <span className={styles.weatherCondition}>{activeScene.weather.condition}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.scrollGuide}>
                        <span className={styles.guideText}>Pastga scroll qiling</span>
                        <span className={styles.guideArrow}>↓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}