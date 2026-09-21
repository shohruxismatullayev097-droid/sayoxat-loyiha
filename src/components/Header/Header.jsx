import { useState } from 'react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { soundscape } from '../../utils/soundscape';
import styles from './Header.module.css';

export function Header() {
    const hidden = useScrollDirection();
    const [lang, setLang] = useState('UZ');
    const [langOpen, setLangOpen] = useState(false);
    const [sound, setSound] = useState(false);

    const languages = ['UZ', 'RU', 'EN'];

    const handleSoundToggle = () => {
        const isPlaying = soundscape.toggle();
        setSound(isPlaying);
    };

    return (
        <header className={`${styles.header} ${hidden ? styles.hidden : ''}`}>
            <div className={styles.pill}>

                {/* LOGO */}
                <a href="#" className={styles.logo}>
                    <span className={styles.logoIcon}>🌍</span>
                    <span className={styles.logoText}>Sayohat</span>
                </a>

                {/* O'NG TOMON */}
                <div className={styles.actions}>

                    {/* TIL */}
                    <div className={styles.langWrap}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => setLangOpen(!langOpen)}
                        >
                            🌐 {lang}
                        </button>
                        {langOpen && (
                            <div className={styles.dropdown}>
                                {languages.map(l => (
                                    <button
                                        key={l}
                                        className={l === lang ? styles.active : ''}
                                        onClick={() => {
                                            setLang(l);
                                            setLangOpen(false);
                                        }}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* TOVUSH (Aniq va ko'rinarli) */}
                    <button
                        className={`${styles.iconBtn} ${sound ? styles.soundActive : ''}`}
                        onClick={handleSoundToggle}
                        title={sound ? "Musiqani o'chirish" : "Fon musiqasini yoqish"}
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
                        <span>{sound ? 'Musiqa yoqildi' : 'Musiqa'}</span>
                    </button>

                </div>
            </div>
        </header>
    );
}