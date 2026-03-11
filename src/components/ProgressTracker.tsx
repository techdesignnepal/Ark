"use client";

import { useState, useEffect, useRef } from 'react';

interface ProgressProps {
    raised: number;
    goal: number;
}

export default function ProgressTracker({ raised, goal }: ProgressProps) {
    const [displayRaised, setDisplayRaised] = useState(0);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;

        let animationFrameId: number;
        let startTime: number | null = null;
        const duration = 2000; // 2 seconds

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // easeOutExpo
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplayRaised(Math.floor(easeOut * raised));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(animate);
            } else {
                setDisplayRaised(raised);
            }
        };

        animationFrameId = window.requestAnimationFrame(animate);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [inView, raised]);

    // Set percentage dynamically based on view triggering the SVG and bar animations simultaneously
    const percentage = inView ? Math.min((raised / goal) * 100, 100) : 0;

    // Shared transform logic for synced alignment
    const hullTransform = {
        transform: percentage >= 40 ? 'translateY(0)' : 'translateY(55px)',
        transition: 'transform 0.9s ease'
    };
    const deckTransform = {
        transform: percentage >= 70 ? 'translateY(0)' : 'translateY(42px)',
        transition: 'transform 0.9s ease'
    };
    const houseTransform = {
        transform: percentage >= 100 ? 'translateY(0)' : 'translateY(-80px)',
        transition: 'transform 0.9s cubic-bezier(0.34, 1.4, 0.64, 1)'
    };

    return (
        <section ref={sectionRef} id="story" className="py-[60px] relative z-10 md:mt-0 w-full">
            <div className="max-w-[1200px] mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 heading-font w-full">
                    <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold tracking-wide leading-none">
                        <span className="text-gold">${displayRaised.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}</span> <span className="text-white">RAISED</span>
                    </h2>
                    <span className="text-text-muted text-sm tracking-widest mb-1 mt-2 md:mt-0 font-medium uppercase">GOAL: ${goal.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}</span>
                </div>

                <div className="relative w-full mb-2 h-1 mt-4">
                    {/* Background Bar */}
                    <div className="h-[2px] w-full bg-white/10 absolute top-1/2 -translate-y-1/2 left-0 rounded-full"></div>
                    {/* Glowing Progress Line */}
                    <div
                        className="h-[2px] absolute top-1/2 -translate-y-1/2 left-0 bg-gold rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${percentage}%`,
                            boxShadow: '0 0 10px 2px rgba(223, 178, 93, 0.8), 0 0 20px 4px rgba(223, 178, 93, 0.4)'
                        }}
                    ></div>
                </div>

                <div className="flex justify-between text-text-muted text-[10px] md:text-xs font-semibold mt-4 px-1">
                    <span>$0</span>
                    <span>$25M</span>
                    <span>$50M</span>
                    <span>$75M</span>
                    <span>$100M</span>
                </div>

                {/* Animated Ark Layers */}
                <div className="relative w-full max-w-[800px] mx-auto mt-16 h-[250px] md:h-[400px]">
                    <svg id="arkSVG" viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_22px_55px_rgba(0,0,0,0.9)] z-10 transition-opacity duration-700">
                        <defs>
                            <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#9A5C18" />
                                <stop offset="45%" stopColor="#7A4210" />
                                <stop offset="100%" stopColor="#4A2806" />
                            </linearGradient>
                            <linearGradient id="gW" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#5A3210" />
                                <stop offset="50%" stopColor="#9A5C20" />
                                <stop offset="100%" stopColor="#7A4410" />
                            </linearGradient>
                            <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C08030" />
                                <stop offset="100%" stopColor="#8A5010" />
                            </linearGradient>
                            <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A06020" />
                                <stop offset="100%" stopColor="#5A3010" />
                            </linearGradient>
                            <linearGradient id="gRS" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7A4810" />
                                <stop offset="100%" stopColor="#3A1C06" />
                            </linearGradient>
                            <pattern id="pH" x="0" y="0" width="55" height="13" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="6.5" x2="55" y2="6.5" stroke="rgba(0,0,0,.22)" strokeWidth="1" />
                            </pattern>
                            <pattern id="pV" x="0" y="0" width="15" height="50" patternUnits="userSpaceOnUse">
                                <line x1="7.5" y1="0" x2="7.5" y2="50" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
                            </pattern>

                            {/* Vertical Reveal Mask (Mapped to ship height: bottom ~320 to top ~20) */}
                            <mask id="revealMask">
                                <rect
                                    x="0"
                                    y={320 - (300 * (percentage / 100))}
                                    width="720"
                                    height="400"
                                    fill="white"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </mask>
                        </defs>

                        {/* GHOST OUTLINE (Persistent Goal / Field) */}
                        <g id="ghost" opacity="0.1" stroke="#F5EDD8" strokeWidth="0.8">
                            {/* Hull Field */}
                            <path d="M 65 240 Q 85 305 125 318 L 595 318 Q 645 305 660 240 L 630 200 L 90 200 Z" fill="rgba(245, 237, 216, 0.04)" />
                            {/* Decorative Hull Lines */}
                            <g fill="none">
                                <path d="M 65 240 Q 75 280 100 305 L 100 200 L 90 200 Z" strokeOpacity="0.5" />
                                <path d="M 125 318 L 595 318" strokeWidth="2" />
                                <rect x="88" y="198" width="544" height="7" rx="2" />
                                <g strokeOpacity="0.3">
                                    <line x1="165" y1="204" x2="148" y2="316" />
                                    <line x1="247" y1="202" x2="242" y2="318" />
                                    <line x1="329" y1="200" x2="329" y2="318" />
                                    <line x1="411" y1="200" x2="413" y2="318" />
                                    <line x1="493" y1="202" x2="500" y2="318" />
                                    <line x1="575" y1="204" x2="572" y2="316" />
                                </g>
                                <path d="M 630 200 Q 665 218 660 240 Q 658 270 645 300" strokeOpacity="0.4" />
                                <path d="M 90 200 Q 55 218 65 240 Q 67 270 80 300" strokeOpacity="0.4" />
                            </g>

                            {/* Deck Field */}
                            <rect x="88" y="148" width="544" height="54" fill="rgba(245, 237, 216, 0.03)" />
                            <rect x="86" y="135" width="548" height="10" rx="2" fill="rgba(245, 237, 216, 0.05)" />
                            {/* Deck Posts */}
                            <g fill="none" strokeOpacity="0.4">
                                <line x1="106" y1="143" x2="106" y2="135" />
                                <line x1="145" y1="143" x2="145" y2="135" />
                                <line x1="184" y1="143" x2="184" y2="135" />
                                <line x1="223" y1="143" x2="223" y2="135" />
                                <line x1="262" y1="143" x2="262" y2="135" />
                                <line x1="301" y1="143" x2="301" y2="135" />
                                <line x1="340" y1="143" x2="340" y2="135" />
                                <line x1="379" y1="143" x2="379" y2="135" />
                                <line x1="418" y1="143" x2="418" y2="135" />
                                <line x1="457" y1="143" x2="457" y2="135" />
                                <line x1="496" y1="143" x2="496" y2="135" />
                                <line x1="535" y1="143" x2="535" y2="135" />
                                <line x1="574" y1="143" x2="574" y2="135" />
                                <line x1="613" y1="143" x2="613" y2="137" />
                            </g>

                            {/* House Field */}
                            <rect x="186" y="80" width="348" height="58" fill="rgba(245, 237, 216, 0.03)" />
                            {/* Arches & Columns */}
                            <g fill="none" strokeOpacity="0.4">
                                <path d="M 210 138 L 210 106 Q 210 88 228 88 Q 246 88 246 106 L 246 138 Z" />
                                <path d="M 340 138 L 340 106 Q 340 88 360 88 Q 380 88 380 106 L 380 138 Z" />
                                <path d="M 474 138 L 474 106 Q 474 88 492 88 Q 510 88 510 106 L 510 138 Z" />
                                <line x1="256" y1="80" x2="256" y2="138" />
                                <line x1="330" y1="80" x2="330" y2="138" />
                                <line x1="390" y1="80" x2="390" y2="138" />
                                <line x1="464" y1="80" x2="464" y2="138" />
                                <line x1="520" y1="80" x2="520" y2="138" />
                            </g>

                            {/* Roof Outline */}
                            <g fill="rgba(245, 237, 216, 0.05)">
                                <path d="M 360 22 L 555 62 L 555 84 L 360 44 Z" />
                                <path d="M 165 62 L 360 22 L 360 44 L 165 84 Z" />
                            </g>
                        </g>

                        {/* COLORED LAYERS (Vertical Reveal) */}
                        <g mask="url(#revealMask)">
                            {/* S1: HULL */}
                            <g id="s1">
                                <path d="M 65 240 Q 85 305 125 318 L 595 318 Q 645 305 660 240 L 630 200 L 90 200 Z" fill="url(#gH)" />
                                <path d="M 65 240 Q 85 305 125 318 L 595 318 Q 645 305 660 240 L 630 200 L 90 200 Z" fill="url(#pH)" opacity=".45" />
                                <path d="M 65 240 Q 75 280 100 305 L 100 200 L 90 200 Z" fill="rgba(0,0,0,.28)" />
                                <path d="M 125 318 L 595 318" stroke="#2A1406" strokeWidth="4" strokeLinecap="round" />
                                <rect x="88" y="198" width="544" height="7" rx="2" fill="#7A4210" />
                                <g stroke="rgba(0,0,0,.22)" strokeWidth="1.5" fill="none">
                                    <line x1="165" y1="204" x2="148" y2="316" />
                                    <line x1="247" y1="202" x2="242" y2="318" />
                                    <line x1="329" y1="200" x2="329" y2="318" />
                                    <line x1="411" y1="200" x2="413" y2="318" />
                                    <line x1="493" y1="202" x2="500" y2="318" />
                                    <line x1="575" y1="204" x2="572" y2="316" />
                                </g>
                                <path d="M 630 200 Q 665 218 660 240 Q 658 270 645 300" stroke="#8A5020" strokeWidth="3" fill="none" strokeLinecap="round" />
                                <path d="M 90 200 Q 55 218 65 240 Q 67 270 80 300" stroke="#8A5020" strokeWidth="3" fill="none" strokeLinecap="round" />
                                <path d="M 115 205 L 605 205" stroke="rgba(255,200,100,.12)" strokeWidth="5" />
                            </g>

                            {/* S2: DECK + WALLS */}
                            <g id="s2">
                                <rect x="88" y="148" width="544" height="54" fill="url(#gW)" />
                                <rect x="88" y="148" width="544" height="54" fill="url(#pH)" opacity=".35" />
                                <rect x="88" y="148" width="30" height="54" fill="rgba(0,0,0,.22)" />
                                <rect x="602" y="148" width="30" height="54" fill="rgba(0,0,0,.15)" />
                                <rect x="86" y="143" width="548" height="9" fill="url(#gD)" />
                                <rect x="86" y="143" width="548" height="9" fill="url(#pV)" opacity=".5" />
                                <rect x="86" y="150" width="548" height="3" fill="rgba(0,0,0,.25)" />
                                <rect x="86" y="135" width="548" height="10" rx="2" fill="#8A5018" />
                                <rect x="86" y="135" width="548" height="2" fill="rgba(255,200,80,.18)" />
                                <g stroke="#5A3010" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="106" y1="143" x2="106" y2="135" />
                                    <line x1="145" y1="143" x2="145" y2="135" />
                                    <line x1="184" y1="143" x2="184" y2="135" />
                                    <line x1="223" y1="143" x2="223" y2="135" />
                                    <line x1="262" y1="143" x2="262" y2="135" />
                                    <line x1="301" y1="143" x2="301" y2="135" />
                                    <line x1="340" y1="143" x2="340" y2="135" />
                                    <line x1="379" y1="143" x2="379" y2="135" />
                                    <line x1="418" y1="143" x2="418" y2="135" />
                                    <line x1="457" y1="143" x2="457" y2="135" />
                                    <line x1="496" y1="143" x2="496" y2="135" />
                                    <line x1="535" y1="143" x2="535" y2="135" />
                                    <line x1="574" y1="143" x2="574" y2="135" />
                                    <line x1="613" y1="143" x2="613" y2="137" />
                                </g>
                                <rect x="86" y="143" width="8" height="54" fill="#4A2808" />
                                <rect x="626" y="143" width="8" height="54" fill="#3A1E06" />
                                <line x1="88" y1="172" x2="632" y2="172" stroke="rgba(0,0,0,.18)" strokeWidth="1.5" />
                            </g>

                            {/* S3: HOUSE + ROOF */}
                            <g id="s3">
                                <rect x="186" y="80" width="348" height="58" fill="url(#gW)" />
                                <rect x="186" y="80" width="348" height="58" fill="url(#pH)" opacity=".3" />
                                <rect x="186" y="80" width="28" height="58" fill="rgba(0,0,0,.25)" />
                                {/* Arches */}
                                <path d="M 210 138 L 210 106 Q 210 88 228 88 Q 246 88 246 106 L 246 138 Z" fill="#0E0C08" stroke="#3A1E06" strokeWidth="1.5" />
                                <path d="M 212 108 Q 212 91 228 91 Q 244 91 244 108" fill="none" stroke="#6A4018" strokeWidth="1.2" />
                                <path d="M 340 138 L 340 106 Q 340 88 360 88 Q 380 88 380 106 L 380 138 Z" fill="#0E0C08" stroke="#3A1E06" strokeWidth="1.5" />
                                <path d="M 342 108 Q 342 91 360 91 Q 378 91 378 108" fill="none" stroke="#6A4018" strokeWidth="1.2" />
                                <path d="M 474 138 L 474 106 Q 474 88 492 88 Q 510 88 510 106 L 510 138 Z" fill="#0E0C08" stroke="#3A1E06" strokeWidth="1.5" />
                                <path d="M 476 108 Q 476 91 492 91 Q 508 91 508 108" fill="none" stroke="#6A4018" strokeWidth="1.2" />
                                {/* Columns */}
                                <g stroke="#5A3010" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="256" y1="80" x2="256" y2="138" />
                                    <line x1="330" y1="80" x2="330" y2="138" />
                                    <line x1="390" y1="80" x2="390" y2="138" />
                                    <line x1="464" y1="80" x2="464" y2="138" />
                                    <line x1="520" y1="80" x2="520" y2="138" />
                                </g>
                                {/* Roof */}
                                <path d="M 360 22 L 555 62 L 555 84 L 360 44 Z" fill="url(#gRS)" stroke="#2A1406" strokeWidth="1.5" />
                                <path d="M 360 22 L 555 62 L 555 84 L 360 44 Z" fill="url(#pH)" opacity=".22" />
                                <path d="M 165 62 L 360 22 L 360 44 L 165 84 Z" fill="url(#gR)" stroke="#2A1406" strokeWidth="1.5" />
                                <path d="M 165 62 L 360 22 L 360 44 L 165 84 Z" fill="url(#pH)" opacity=".28" />
                                <line x1="165" y1="62" x2="555" y2="62" stroke="#2A1406" strokeWidth="3.5" strokeLinecap="round" />
                                <line x1="360" y1="14" x2="360" y2="28" stroke="#C9943A" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="360" cy="12" r="5" fill="#C9943A" stroke="#F0C060" strokeWidth="1.5" />
                                <rect x="158" y="85" width="404" height="5" fill="#4A2808" />
                                <path d="M 153 82 L 163 62 L 165 84 L 153 84 Z" fill="#5A3010" />
                                <path d="M 563 82 L 557 62 L 555 84 L 563 84 Z" fill="#3A1E06" />
                                <g stroke="rgba(0,0,0,.14)" strokeWidth=".8" fill="none">
                                    <line x1="205" y1="60" x2="192" y2="83" />
                                    <line x1="236" y1="53" x2="222" y2="83" />
                                    <line x1="268" y1="46" x2="252" y2="83" />
                                    <line x1="300" y1="39" x2="282" y2="83" />
                                    <line x1="332" y1="32" x2="312" y2="83" />
                                </g>
                                <path d="M 170 67 L 348 26" stroke="rgba(255,210,100,.18)" strokeWidth="5" strokeLinecap="round" />
                                <rect x="158" y="90" width="404" height="4" fill="rgba(0,0,0,.22)" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </section>
    );
}
