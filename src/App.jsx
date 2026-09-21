import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header/Header';
import { Globe } from './components/Globe/Globe';
import { CountryList } from './components/CountryList/CountryList';
import { CountryPage } from './pages/CountryPage/CountryPage';
import './index.css';
import './styles/animations.css';

function App() {
    const [selected, setSelected] = useState(null);
    const [targetCountry, setTargetCountry] = useState(null);
    const overlayRef = useRef();

    const handleSelect = (country) => {
        if (targetCountry || selected) return;

        // 1. Kamera globusda aylanadi (2 sekund)
        setTargetCountry(country);

        // 2. Yetib kelgandan keyin — transition
        setTimeout(() => {
            const overlay = overlayRef.current;
            const tl = gsap.timeline();

            tl.set(overlay, { display: 'flex', opacity: 0 })
              .to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.in' })
              .add(() => {
                  setSelected(country);
                  setTargetCountry(null);
              })
              .to(overlay, { opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' })
              .set(overlay, { display: 'none' });
        }, 2000);
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
                <CountryPage country={selected} onClose={handleBack} />
            ) : (
                <div className="app">
                    <Header />
                    <main className="main">
                        <section className="hero">
                            <div className="hero-globe">
                                <Globe targetCountry={targetCountry} onSelect={handleSelect} />
                            </div>

                            {!targetCountry && (
                                <CountryList
                                    activeId={null}
                                    onSelect={handleSelect}
                                />
                            )}

                            {!targetCountry && (
                                <div className="hero-text">
                                    <h1>Sayohat</h1>
                                    <p>Dunyoni kashf et</p>
                                </div>
                            )}

                            {targetCountry && (
                                <div className="hero-text loading-text">
                                    <p>{targetCountry.flag} {targetCountry.name.uz}ga uchib borilmoqda...</p>
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