import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header/Header';
import { Globe } from './components/Globe/Globe';
import { CountryList } from './components/CountryList/CountryList';
import { CountryPage } from './pages/CountryPage/CountryPage';
import './index.css';
import './styles/animations.css';

function App() {
    const CAMERA_TRANSITION_MS = 4200;
    const [selected, setSelected] = useState(null);
    const [targetCountry, setTargetCountry] = useState(null);
    const [language, setLanguage] = useState('uz');
    const homeText = {
        uz: { title: 'Sayohat', subtitle: 'Dunyoni kashf et', flight: 'ga uchib borilmoqda...' },
        ru: { title: 'Путешествие', subtitle: 'Откройте мир', flight: ' — полёт к стране...' },
        en: { title: 'Travel', subtitle: 'Discover the world', flight: ' — flying to...' },
    }[language];
    const overlayRef = useRef();

    const handleSelect = (country) => {
        if (targetCountry || selected) return;

        // Kamera globusda sekin aylanib, tanlangan davlatga yaqinlashadi.
        setTargetCountry(country);

        // Kamera yetib kelgandan keyin sahifani almashtiramiz.
        setTimeout(() => {
            const overlay = overlayRef.current;
            const tl = gsap.timeline();

            tl.set(overlay, { display: 'flex', opacity: 0 })
              .to(overlay, { opacity: 1, duration: 0.8, ease: 'power2.in' })
              .add(() => {
                  setSelected(country);
                  setTargetCountry(null);
              })
              .to(overlay, { opacity: 0, duration: 0.9, delay: 0.7, ease: 'power2.out' })
              .set(overlay, { display: 'none' });
        }, CAMERA_TRANSITION_MS);
    };

    const handleBack = () => {
        const overlay = overlayRef.current;
        const tl = gsap.timeline();

        tl.set(overlay, { display: 'flex', opacity: 0 })
          .to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.in' })
          .add(() => setSelected(null))
          .to(overlay, { opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' })
          .set(overlay, { display: 'none' });
    };

    return (
        <>
            <div ref={overlayRef} className="transition-overlay">
                <div className="transition-star" />
            </div>

            {selected ? (
                <CountryPage
                    country={selected}
                    onClose={handleBack}
                    language={language}
                    onLanguageChange={setLanguage}
                />
            ) : (
                <div className="app">
                    <Header language={language} onLanguageChange={setLanguage} />
                    <main className="main">
                        <section className="hero">
                            <div className="hero-globe">
                                <Globe targetCountry={targetCountry} onSelect={handleSelect} />
                            </div>

                            {!targetCountry && (
                                <CountryList
                                    activeId={null}
                                    onSelect={handleSelect}
                                    language={language}
                                />
                            )}

                            {!targetCountry && (
                                <div className="hero-text">
                                    <h1>{homeText.title}</h1>
                                    <p>{homeText.subtitle}</p>
                                </div>
                            )}

                            {targetCountry && (
                                <div className="hero-text loading-text">
                                                <p>{targetCountry.flag} {targetCountry.name[language]}{homeText.flight}</p>
                                    <span>{targetCountry.intro}</span>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            )}
        </>
    );
}

export default App;