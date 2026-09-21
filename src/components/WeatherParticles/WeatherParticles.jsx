import { useEffect, useRef } from 'react';

export function WeatherParticles({ type = 'fireflies', intensity = 1.0 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle configuration based on weather type
        const particleCount = type === 'snow' ? 55 : (type === 'sand' ? 65 : 40);
        const particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: type === 'snow' ? Math.random() * 2.5 + 1.2 : (type === 'sand' ? Math.random() * 2.0 + 0.8 : Math.random() * 2.8 + 1.0),
            speedX: type === 'sand' ? Math.random() * 1.8 + 0.6 : (type === 'snow' ? Math.random() * 0.6 - 0.3 : Math.random() * 0.5 - 0.25),
            speedY: type === 'snow' ? Math.random() * 1.5 + 0.6 : (type === 'sand' ? Math.random() * 0.4 - 0.2 : Math.random() * 0.6 - 0.3),
            opacity: Math.random() * 0.6 + 0.2,
            pulse: Math.random() * Math.PI * 2,
        }));

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += 0.03;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                if (type === 'fireflies') {
                    // Glowing cyan / golden night particles
                    const glowAlpha = (Math.sin(p.pulse) * 0.3 + 0.5) * p.opacity;
                    ctx.fillStyle = `rgba(180, 240, 255, ${glowAlpha})`;
                    ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
                    ctx.shadowBlur = 8;
                } else if (type === 'sand') {
                    // Golden warm desert sand particles
                    ctx.fillStyle = `rgba(235, 195, 120, ${p.opacity * 0.7})`;
                    ctx.shadowColor = 'rgba(235, 180, 80, 0.4)';
                    ctx.shadowBlur = 4;
                } else if (type === 'snow') {
                    // Soft crisp white alpine snow flakes
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
                    ctx.shadowBlur = 5;
                } else {
                    // Soft twilight dust
                    ctx.fillStyle = `rgba(240, 230, 210, ${p.opacity * 0.5})`;
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [type, intensity]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 3,
            }}
        />
    );
}
