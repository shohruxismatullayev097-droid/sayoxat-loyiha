import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicDroneStage } from '../../three/CinematicDroneStage';
import { WeatherParticles } from '../../components/WeatherParticles/WeatherParticles';
import { soundscape } from '../../utils/soundscape';
import styles from './SceneScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

const sceneTranslations = {
    ru: {
        samarqand: { eyebrow: 'ЗНАНИЯ И ВЕЛИЧИЕ', story: 'Среди бирюзовых изразцов история не молчит: каждый портал рассказывает об искусстве и науке своей эпохи.', fact: 'Ансамбль Регистана состоит из трёх медресе — Улугбека, Шердора и Тиллякари.', feeling: 'Здесь время замедляется.', labels: ['АРХИТЕКТУРА', 'ВПЕЧАТЛЕНИЕ', 'МАРШРУТ'], discoveries: ['Бирюзовые изразцы превращают солнечный свет в мозаику.', 'Остановитесь перед Регистаном на рассвете и почувствуйте масштаб площади.', 'Самарканд · открытие за 1 день'] },
        buxoro: { eyebrow: 'ИСТОРИЯ В ТИШИНЕ', story: 'Узкие улицы меняют солнечный свет тенью. В Бухаре путешествие становится воспоминанием.', fact: 'Исторический центр Бухары внесён в список наследия ЮНЕСКО в 1993 году.', feeling: 'Дыхание древнего города.', labels: ['НАСЛЕДИЕ', 'ВПЕЧАТЛЕНИЕ', 'МАРШРУТ'], discoveries: ['Минарет Калян служил ориентиром для древних караванов.', 'Выпейте чай у Ляби-Хауза и почувствуйте ритм города.', 'Старый город Бухары · 2 дня'] },
        xiva: { eyebrow: 'МУЗЕЙ ПОД ОТКРЫТЫМ НЕБОМ', story: 'Глиняные стены Хивы впитывают цвет пустыни и на закате окрашивают город в золото.', fact: 'Внутри стен Ичан-Калы сохранилось более 50 исторических памятников.', feeling: 'Сказка посреди пустыни.', labels: ['ЦВЕТА', 'ВПЕЧАТЛЕНИЕ', 'МАРШРУТ'], discoveries: ['Стены из пахсы становятся медовыми в лучах закатного солнца.', 'Пройдите по улицам Ичан-Калы без спешки.', 'Хива · прогулка по древнему городу'] },
        toshkent: { eyebrow: 'РИТМ ГОРОДА', story: 'В Ташкенте шум древнего базара встречается с огнями современного города.', fact: 'Многие станции ташкентского метро известны своей уникальной архитектурой.', feeling: 'Спокойствие внутри движения.', labels: ['ГОРОД', 'ВПЕЧАТЛЕНИЕ', 'МАРШРУТ'], discoveries: ['Под куполом Чорсу встречаются цвета, запахи и голоса.', 'Рассматривайте станции метро как отдельную галерею.', 'Ташкент · почувствовать ритм города'] },
        chimyon: { eyebrow: 'СВОБОДА В ГОРАХ', story: 'Чем выше поднимаешься, тем дальше остаётся городской шум. Здесь даже ветер показывает дорогу.', fact: 'Чимган — один из самых известных туристических районов Западного Тянь-Шаня.', feeling: 'Простор для дыхания.', labels: ['ПРИРОДА', 'ВПЕЧАТЛЕНИЕ', 'МАРШРУТ'], discoveries: ['Горный воздух прозрачен, а горизонт расширяется с каждым шагом.', 'Встретьте рассвет у Чарвака — горы медленно меняют цвет.', 'Чимган · горное путешествие на 1–2 дня'] },
    },
    en: {
        samarqand: { eyebrow: 'KNOWLEDGE AND GRANDEUR', story: 'History speaks through the turquoise tiles: every portal tells a story of its era’s art and science.', fact: 'Registan is formed by three madrasas — Ulugh Beg, Sher-Dor and Tilla-Kari.', feeling: 'Time slows down here.', labels: ['ARCHITECTURE', 'EXPERIENCE', 'ROUTE'], discoveries: ['Turquoise tiles turn sunlight into a living mosaic.', 'Stand before Registan at dawn and feel the scale of the square.', 'Samarkand · a one-day discovery'] },
        buxoro: { eyebrow: 'HISTORY IN SILENCE', story: 'Narrow streets trade sunlight for shadow. In Bukhara, a journey becomes a memory.', fact: 'The historic centre of Bukhara joined the UNESCO heritage list in 1993.', feeling: 'The breath of an ancient city.', labels: ['HERITAGE', 'EXPERIENCE', 'ROUTE'], discoveries: ['Kalyan Minaret guided ancient caravans across the city.', 'Have tea by Lyabi-Hauz and let the city slow down.', 'Old Bukhara · two-day discovery'] },
        xiva: { eyebrow: 'AN OPEN-AIR MUSEUM', story: 'Khiva’s clay walls absorb the desert light and turn golden at sunset.', fact: 'More than 50 historic monuments remain inside the walls of Itchan Kala.', feeling: 'A fairytale in the desert.', labels: ['COLOUR', 'EXPERIENCE', 'ROUTE'], discoveries: ['The mud-brick walls glow honey-gold at sunset.', 'Walk through Itchan Kala slowly, without a schedule.', 'Khiva · a walk through history'] },
        toshkent: { eyebrow: 'CITY RHYTHM', story: 'In Tashkent, the sound of an old bazaar meets the lights of a modern city.', fact: 'Many Tashkent metro stations are known for their distinctive architecture.', feeling: 'Calm inside the movement.', labels: ['CITY', 'EXPERIENCE', 'ROUTE'], discoveries: ['Under Chorsu’s dome, colours, scents and voices meet.', 'Explore the metro stations as an underground gallery.', 'Tashkent · feel the city rhythm'] },
        chimyon: { eyebrow: 'FREEDOM IN THE MOUNTAINS', story: 'The higher you climb, the farther the city noise falls away. Here, even the wind guides you.', fact: 'Chimgan is one of the best-known destinations in the Western Tian Shan.', feeling: 'Room to breathe.', labels: ['NATURE', 'EXPERIENCE', 'ROUTE'], discoveries: ['The mountain air is clear and the horizon widens with every step.', 'Meet the sunrise by Charvak as the mountains change colour.', 'Chimgan · a one or two-day mountain escape'] },
    },
};

const uiTranslations = {
    uz: { continue: 'Sayohatni davom ettiring', fact: 'BILASIZMI?', speed: 'Tezlik', tomorrow: 'Ertaga' },
    ru: { continue: 'Продолжайте путешествие', fact: 'ЗНАЕТЕ ЛИ ВЫ?', speed: 'Скорость', tomorrow: 'Завтра' },
    en: { continue: 'Continue the journey', fact: 'DID YOU KNOW?', speed: 'Speed', tomorrow: 'Tomorrow' },
};

const cityCoordinates = {
    samarqand: { latitude: 39.6542, longitude: 66.9597 },
    buxoro: { latitude: 39.7747, longitude: 64.4286 },
    xiva: { latitude: 41.3775, longitude: 60.3639 },
    toshkent: { latitude: 41.2995, longitude: 69.2401 },
    chimyon: { latitude: 41.5, longitude: 70.05 },
};

const weatherCodeText = {
    uz: { clear: 'Ochiq osmon', cloudy: 'Bulutli', rain: 'Yomg‘ir', snow: 'Qor', storm: 'Momaqaldiroq', fog: 'Tuman' },
    ru: { clear: 'Ясное небо', cloudy: 'Облачно', rain: 'Дождь', snow: 'Снег', storm: 'Гроза', fog: 'Туман' },
    en: { clear: 'Clear sky', cloudy: 'Cloudy', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm', fog: 'Fog' },
};

function getWeatherLabel(code, language) {
    const labels = weatherCodeText[language] || weatherCodeText.uz;
    if (code <= 1) return { label: labels.clear, icon: '☀️' };
    if (code <= 3) return { label: labels.cloudy, icon: '⛅' };
    if ([45, 48].includes(code)) return { label: labels.fog, icon: '🌫️' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: labels.snow, icon: '❄️' };
    if ([95, 96, 99].includes(code)) return { label: labels.storm, icon: '⛈️' };
    return { label: labels.rain, icon: '🌧️' };
}

export function SceneScroll({ scenes, language = 'uz' }) {
    const containerRef = useRef();
    const progressRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [liveWeather, setLiveWeather] = useState({});
    const activeIdxRef = useRef(0);
    const transitioningRef = useRef(false);
    const soundSceneRef = useRef(null);
    const soundTransitionRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        const loadWeather = async () => {
            const results = await Promise.all(scenes.map(async (scene) => {
                const coordinates = cityCoordinates[scene.id];
                if (!coordinates) return null;

                try {
                    const params = new URLSearchParams({
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        current: 'temperature_2m,weather_code,is_day,wind_speed_10m',
                        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
                        forecast_days: '2',
                        timezone: 'Asia/Tashkent',
                    });
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
                    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
                    const data = await response.json();
                    const currentType = getWeatherLabel(data.current.weather_code, language);
                    const tomorrowType = getWeatherLabel(data.daily.weather_code[1], language);
                    return [scene.id, {
                        temp: `${Math.round(data.current.temperature_2m)}°C`,
                        condition: currentType.label,
                        icon: data.current.is_day ? currentType.icon : '🌙',
                        tomorrow: `${Math.round(data.daily.temperature_2m_min[1])}° / ${Math.round(data.daily.temperature_2m_max[1])}°C`,
                        tomorrowIcon: tomorrowType.icon,
                    }];
                } catch {
                    return null;
                }
            }));

            if (!cancelled) setLiveWeather(Object.fromEntries(results.filter(Boolean)));
        };

        loadWeather();
        const refreshTimer = window.setInterval(loadWeather, 10 * 60 * 1000);
        return () => {
            cancelled = true;
            window.clearInterval(refreshTimer);
        };
    }, [scenes, language]);

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
                if (activeIdxRef.current !== idx) {
                    activeIdxRef.current = idx;
                    setActiveIdx(idx);
                }
                if (transitioningRef.current !== transitioning) {
                    transitioningRef.current = transitioning;
                    setIsTransitioning(transitioning);
                }

                // Manzilga qarab tovush o'zgartirish
                if (soundTransitionRef.current !== transitioning) {
                    soundTransitionRef.current = transitioning;
                    soundscape.setSpeedFlight(transitioning ? 1.0 : 0.0);
                }
                if (scenes[idx] && soundSceneRef.current !== scenes[idx].id) {
                    soundSceneRef.current = scenes[idx].id;
                    soundscape.setLocationWeather(scenes[idx].id);
                }
            },
        });

        return () => trigger.kill();
    }, [scenes]);

    const activeScene = scenes[activeIdx] || scenes[0];
    const nextScene = scenes[activeIdx + 1];
    const translated = sceneTranslations[language]?.[activeScene.id];
    const ui = uiTranslations[language] || uiTranslations.uz;
    const text = (field) => translated?.[field] || activeScene[field]?.[language] || activeScene[field]?.uz || activeScene[field] || '';
    const weather = liveWeather[activeScene.id] || activeScene.weather;

    return (
        <div ref={containerRef} className={styles.flightContainer}>
            <div className={styles.stageWrap} data-scene={activeScene.id}>
                {/* 3D WebGL Unified Drone Stage */}
                <CinematicDroneStage scenes={scenes} progressRef={progressRef} />

                {/* Real-time Atmospheric Climate & Weather Particles */}
                <WeatherParticles type={activeScene.weather?.particleType || 'fireflies'} />

                {/* Subtle Cinematic Vignette */}
                <div className={styles.cinematicShade} />

                <div className={styles.discoveryLayer} aria-label={`${activeScene.title[language]} haqida`}>
                    {activeScene.discovery?.map((item, index) => (
                        <aside
                            className={`${styles.discoveryCard} ${styles[`discovery${index + 1}`]}`}
                            key={`${activeScene.id}-${item.label}`}
                        >
                            <span>{translated?.labels?.[index] || item.label}</span>
                            <p>{translated?.discoveries?.[index] || item.text}</p>
                        </aside>
                    ))}
                </div>

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
                            <span>{nextScene.title[language]} sari uchilmoqda...</span>
                        </div>
                    )}

                    <article className={styles.titleCard} key={activeScene.id}>
                        <span className={styles.eyebrow}>{text('eyebrow')}</span>
                        <h2 className={styles.titleText}>{activeScene.title[language]}</h2>
                        <p className={styles.subtitleText}>{activeScene.subtitle[language]}</p>
                        <p className={styles.storyText}>{text('story')}</p>

                        {weather && (
                            <div className={styles.metaRow}>
                                <div className={styles.weatherMini}>
                                    <span>{weather.icon}</span>
                                    <span>{weather.temp}</span>
                                    <span className={styles.weatherCondition}>
                                        {weather.condition}
                                    </span>
                                </div>
                                {weather.tomorrow && (
                                    <span className={styles.metaItem}>{ui.tomorrow}: {weather.tomorrowIcon} {weather.tomorrow}</span>
                                )}
                                <span className={styles.metaItem}>{ui.speed}: {activeScene.speed.replace('Tezlik: ', '')}</span>
                            </div>
                        )}
                        <div className={styles.factPanel}>
                            <span className={styles.factLabel}>{ui.fact}</span>
                            <p>{text('fact')}</p>
                        </div>
                        <p className={styles.feeling}>{text('feeling')}</p>
                    </article>

                    <div className={styles.scrollGuide}>
                        <span className={styles.guideText}>{ui.continue}</span>
                        <span className={styles.guideArrow}>↓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}