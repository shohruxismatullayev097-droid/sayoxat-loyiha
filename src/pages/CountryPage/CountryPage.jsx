import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SceneScroll } from './SceneScroll';
import { Header } from '../../components/Header/Header';
import { uzbekistanScenes } from '../../data/scenes/uzbekistan';
import { BookingModal } from '../../components/BookingModal/BookingModal';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import styles from './CountryPage.module.css';

const pageText = {
    uz: {
        back: 'Globusga qaytish',
        heroEyebrow: 'MARKAZIY OSIYO  /  QADIMIY MEROS',
        destinationEyebrow: "SAYOHAT YO'NALISHI",
        start: 'Sayohatni boshlang — pastga scroll qiling',
        bookingTitle: 'Sayohatni bron qiling',
        bookingDesc: 'O‘zbekistondagi sayohatingizni bugun rejalashtiring. Marshrutni siz uchun tayyorlaymiz.',
        bookingPoints: ['Shaxsiy marshrut', 'Mahalliy gid', 'Moslashuvchan reja'],
        bookingButton: 'Sayohatni bron qilish',
        aboutBadge: 'Men haqimda',
        role: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Bu loyiha React, Three.js, GSAP va WebGL texnologiyalari asosida yaratilgan.',
        github: 'GitHub loyihasi',
        portfolio: 'GitHub portfolio',
        telegram: 'Telegram',
        footer: 'Interaktiv sayohat tajribasi',
    },
    ru: {
        back: 'Вернуться к глобусу',
        heroEyebrow: 'ЦЕНТРАЛЬНАЯ АЗИЯ  /  ДРЕВНЕЕ НАСЛЕДИЕ',
        destinationEyebrow: 'НАПРАВЛЕНИЕ ПУТЕШЕСТВИЯ',
        start: 'Начните путешествие — листайте вниз',
        bookingTitle: 'Забронировать путешествие',
        bookingDesc: 'Спланируйте путешествие по Узбекистану. Мы подготовим маршрут специально для вас.',
        bookingPoints: ['Личный маршрут', 'Местный гид', 'Гибкий план'],
        bookingButton: 'Забронировать поездку',
        aboutBadge: 'О проекте',
        role: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Проект создан с использованием React, Three.js, GSAP и WebGL.',
        github: 'Проект на GitHub',
        portfolio: 'GitHub портфолио',
        telegram: 'Telegram',
        footer: 'Интерактивное путешествие',
    },
    en: {
        back: 'Back to globe',
        heroEyebrow: 'CENTRAL ASIA  /  ANCIENT HERITAGE',
        destinationEyebrow: 'TRAVEL DESTINATION',
        start: 'Start your journey — scroll down',
        bookingTitle: 'Book your journey',
        bookingDesc: 'Plan your journey through Uzbekistan. We will prepare a route made for you.',
        bookingPoints: ['Personal route', 'Local guide', 'Flexible plan'],
        bookingButton: 'Book a trip',
        aboutBadge: 'About the project',
        role: 'Full-Stack Developer & UI/UX Designer',
        bio: 'This project is built with React, Three.js, GSAP and WebGL.',
        github: 'GitHub project',
        portfolio: 'GitHub portfolio',
        telegram: 'Telegram',
        footer: 'An interactive travel experience',
    },
};

export function CountryPage({ country, onClose, language = 'uz', onLanguageChange }) {
    const pageRef = useRef();
    const heroRef = useRef();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const text = pageText[language] || pageText.uz;

    // Enable silky smooth Lenis scroll for the cinematic flight
    useSmoothScroll();

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            pageRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
        );

        tl.fromTo(
            heroRef.current.querySelectorAll('[data-hero]'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
            '-=0.5'
        );

        return () => tl.kill();
    }, []);

    const heroBg = country.id === 'uzbekistan'
        ? `linear-gradient(180deg, rgba(2,3,8,0.4) 0%, rgba(2,3,8,0.95) 100%), url(/scenes/uz/samarqand/samarqand.jpg)`
        : `linear-gradient(180deg, rgba(2,3,8,0.4) 0%, rgba(2,3,8,0.95) 100%), url(https://picsum.photos/seed/${country.id}-hero-fixed/1920/1080)`;

    return (
        <div ref={pageRef} className={styles.page}>
            <Header
                language={language}
                onLanguageChange={onLanguageChange}
                variant="country"
            />
            {/* Ortga qaytish — BOSHIDA */}
            <button className={styles.back} onClick={onClose}>
                <svg viewBox="0 0 24 24" width="16" height="16"
                     fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                {text.back}
            </button>

            <section
                ref={heroRef}
                className={styles.hero}
                style={{ backgroundImage: heroBg }}
            >
                <span data-hero className={styles.flag}>{country.flag}</span>
                <p data-hero className={styles.heroEyebrow}>
                    {country.id === 'uzbekistan' ? text.heroEyebrow : text.destinationEyebrow}
                </p>
                <h1 data-hero className={styles.title}>{country.name[language]}</h1>
                <p data-hero className={styles.subtitle}>
                    {text.start}
                </p>
                <div data-hero className={styles.heroArrow}>↓</div>
            </section>

            <SceneScroll scenes={uzbekistanScenes} language={language} />

            {/* =============================================
                BRON QILISH BO'LIMI (Oxirida)
                ============================================= */}
            <div className={styles.finalPanels}>
                <section className={styles.bookingSection}>
                    <div className={styles.bookingInner}>
                        <div className={styles.planeTrack} aria-hidden="true">
                            <div className={styles.flightClouds}>
                                <span className={`${styles.flightCloud} ${styles.cloudOne}`} />
                                <span className={`${styles.flightCloud} ${styles.cloudTwo}`} />
                                <span className={`${styles.flightCloud} ${styles.cloudThree}`} />
                                <span className={`${styles.flightCloud} ${styles.cloudFour}`} />
                                <span className={`${styles.flightCloud} ${styles.cloudFive}`} />
                            </div>
                            <div className={styles.flightRain} />
                            <div className={styles.plane3d}>
                                <span className={styles.planeBody} />
                                <span className={styles.planeWing} />
                                <span className={styles.planeTail} />
                                <span className={styles.planeCockpit} />
                            </div>
                        </div>
                        <h2 className={styles.bookingTitle}>{text.bookingTitle}</h2>
                        <p className={styles.bookingDesc}>
                            {country.name[language]} — {text.bookingDesc}
                        </p>
                        <div className={styles.bookingBenefits}>
                            {text.bookingPoints.map((point) => <span key={point}>{point}</span>)}
                        </div>
                        <button
                            className={styles.bookingBtn}
                            onClick={() => setIsBookingOpen(true)}
                        >
                            {text.bookingButton}
                        </button>
                    </div>
                </section>

                <section className={styles.aboutSection}>
                    <div className={styles.aboutInner}>
                        <div className={styles.aboutBadge}>{text.aboutBadge}</div>
                        <h2 className={styles.aboutTitle}>Shoxrux</h2>
                        <p className={styles.aboutRole}>{text.role}</p>
                        <p className={styles.aboutBio}>
                            {text.bio} {language === 'uz' && 'Maqsad — zamonaviy, interaktiv va vizual boy veb-tajriba yaratish.'}
                        </p>
                        <div className={styles.techStack}>
                            <span className={styles.techTag}>React</span>
                            <span className={styles.techTag}>Three.js</span>
                            <span className={styles.techTag}>GSAP</span>
                            <span className={styles.techTag}>WebGL</span>
                            <span className={styles.techTag}>Vite</span>
                            <span className={styles.techTag}>Lenis</span>
                        </div>
                        <div className={styles.aboutLinks}>
                            <a href="https://github.com/shohruxismatullayev097-droid/sayoxat-loyiha" target="_blank" rel="noopener noreferrer" className={styles.aboutLink}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                {text.github}
                            </a>
                            <a href="https://github.com/shohruxismatullayev097-droid" target="_blank" rel="noopener noreferrer" className={styles.aboutLink}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                {text.portfolio}
                            </a>
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className={styles.aboutLink}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.5 3.5 20.1 20.1c-.3 1.2-1 1.5-2.1.9l-5.8-4.3-2.8 2.7c-.3.3-.5.5-1 .5l.4-5.9 10.7-9.7c.5-.4-.1-.6-.8-.2L5.5 12.8.1 11.1c-1.2-.4-1.2-1.2.3-1.8L21.7 1c1-.4 2 .2 1.8 2.5z"/>
                                </svg>
                                {text.telegram}
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* Ortga qaytish — OXIRIDA */}
            <div className={styles.bottomBackWrap}>
                <button className={styles.bottomBack} onClick={onClose}>
                    <svg viewBox="0 0 24 24" width="18" height="18"
                         fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Globusga qaytish
                </button>
            </div>

            <footer className={styles.footer}>
                <p>© 2026 Sayohat — {country.name[language]}</p>
                <span>{text.footer}</span>
            </footer>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                countryName={country.name[language]}
                initialCity={uzbekistanScenes[0]?.title?.[language] || country.name[language]}
                language={language}
            />
        </div>
    );
}