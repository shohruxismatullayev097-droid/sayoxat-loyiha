import { useEffect, useState, useRef } from 'react';

export function useScrollDirection() {
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);
    const stopTimer = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;

            // Tepaga scroll — darrov ko'rsat
            if (y < lastY.current) {
                setHidden(false);
            }
            // Pastga scroll — yashir
            else if (y > lastY.current && y > 100) {
                setHidden(true);
            }

            lastY.current = y;

            // To'xtashni aniqlash (2 sekund)
            clearTimeout(stopTimer.current);
            stopTimer.current = setTimeout(() => {
                setHidden(false);
            }, 2000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(stopTimer.current);
        };
    }, []);

    return hidden;
}