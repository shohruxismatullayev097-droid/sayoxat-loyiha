import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SceneScroll } from './SceneScroll';
import { uzbekistanScenes } from '../../data/scenes/uzbekistan';
import { BookingModal } from '../../components/BookingModal/BookingModal';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import styles from './CountryPage.module.css';

export function CountryPage({ country, onClose }) {
    const pageRef = useRef();
    const heroRef = useRef();
    const [isBookingOpen, setIsBookingOpen] = useState(false);

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
            {/* Ortga qaytish — BOSHIDA */}
            <button className={styles.back} onClick={onClose}>
                <svg viewBox="0 0 24 24" width="16" height="16"
                     fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Globusga qaytish
            </button>

            <section
                ref={heroRef}
                className={styles.hero}
                style={{ backgroundImage: heroBg }}
            >
                <span data-hero className={styles.flag}>{country.flag}</span>
                <h1 data-hero className={styles.title}>{country.name.uz}</h1>
                <p data-hero className={styles.subtitle}>
                    Sayohatni boshlang — pastga scroll qiling
                </p>
                <div data-hero className={styles.heroArrow}>↓</div>
            </section>

            <SceneScroll scenes={uzbekistanScenes} />

            {/* =============================================
                BRON QILISH BO'LIMI (Oxirida)
                ============================================= */}
            <section className={styles.bookingSection}>
                <div className={styles.bookingInner}>
                    <span className={styles.bookingIcon}>✈️</span>
                    <h2 className={styles.bookingTitle}>Sayohatni bron qiling</h2>
                    <p className={styles.bookingDesc}>
                        {country.name.uz}ning eng go'zal joylarini o'z ko'zingiz bilan ko'ring.
                        Biz sizga to'liq sayohat rejasini tayyorlaymiz.
                    </p>
                    <button
                        className={styles.bookingBtn}
                        onClick={() => setIsBookingOpen(true)}
                    >
                        ✈️ Sayohatni bron qilish
                    </button>
                </div>
            </section>

            {/* =============================================
                PORTFOLIO / HAQIMDA BO'LIMI
                ============================================= */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutInner}>
                    <div className={styles.aboutBadge}>Men haqimda</div>
                    <h2 className={styles.aboutTitle}>Shoxrux</h2>
                    <p className={styles.aboutRole}>Full-Stack Developer & UI/UX Designer</p>
                    <p className={styles.aboutBio}>
                        Bu loyiha React, Three.js, GSAP va WebGL texnologiyalari asosida yaratilgan.
                        Mening maqsadim — zamonaviy, interaktiv va vizual boy veb-tajribalar yaratish.
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
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.aboutLink}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer" className={styles.aboutLink}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            Telegram
                        </a>
                    </div>
                </div>
            </section>

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
                <p>© 2026 Sayohat — {country.name.uz}</p>
            </footer>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                countryName={country.name.uz}
                initialCity={uzbekistanScenes[0]?.title?.uz || country.name.uz}
            />
        </div>
    );
}