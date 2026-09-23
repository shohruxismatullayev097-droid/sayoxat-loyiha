import { useEffect, useRef, useState } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { soundscape } from '../../utils/soundscape';
import styles from './Header.module.css';

export function Header({ language = 'uz', onLanguageChange, variant = 'default' }) {
    const hidden = useScrollDirection();
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef();
    const [sound, setSound] = useState(false);

    const languages = [
        { code: 'UZ', value: 'uz' },
        { code: 'RU', value: 'ru' },
        { code: 'EN', value: 'en' },
    ];
    const soundText = {
        uz: { on: 'Musiqa yoqildi', off: 'Musiqa', onTitle: "Musiqani o'chirish", offTitle: 'Fon musiqasini yoqish' },
        ru: { on: 'Музыка включена', off: 'Музыка', onTitle: 'Выключить музыку', offTitle: 'Включить фоновую музыку' },
        en: { on: 'Music on', off: 'Music', onTitle: 'Turn music off', offTitle: 'Turn background music on' },
    }[language] || {};

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const handleSoundToggle = () => {
        const isPlaying = soundscape.toggle();
        setSound(isPlaying);
    };

    return (
        <header className={`${styles.header} ${variant === 'country' ? styles.countryHeader : ''} ${hidden ? styles.hidden : ''}`}>
            <div className={styles.pill}>

                {/* LOGO */}
                <a href="#" className={styles.logo}>
                    <span className={styles.logoIcon}>🌍</span>
                    <span className={styles.logoText}>Sayohat</span>
                </a>

                {/* O'NG TOMON */}
                <div className={styles.actions}>

                    {/* TIL */}
                    <div ref={langRef} className={styles.langWrap}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => setLangOpen(!langOpen)}
                        >
                            🌐 {language.toUpperCase()}
                        </button>
                        {langOpen && (
                            <div className={styles.dropdown}>
                                {languages.map(l => (
                                    <button
                                        key={l.value}
                                        className={l.value === language ? styles.active : ''}
                                        onClick={() => {
                                            onLanguageChange?.(l.value);
                                            setLangOpen(false);
                                        }}
                                    >
                                        {l.code}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* TOVUSH (Aniq va ko'rinarli) */}
                    <button
                        className={`${styles.iconBtn} ${sound ? styles.soundActive : ''}`}
                        onClick={handleSoundToggle}
                        title={sound ? soundText.onTitle : soundText.offTitle}
                        style={{
                            background: sound ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                            borderColor: sound ? 'rgba(6, 182, 212, 0.6)' : 'rgba(255, 255, 255, 0.12)',
                            color: sound ? '#06b6d4' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '100px',
                            fontWeight: '600',
                            fontSize: '12px',
                        }}
                    >
                        <span>{sound ? '🔊' : '🔇'}</span>
                        <span>{sound ? soundText.on : soundText.off}</span>
                    </button>

                </div>
            </div>
        </header>
    );
}