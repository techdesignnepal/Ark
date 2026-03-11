"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || menuOpen ? 'py-4 bg-navy/95 backdrop-blur-md border-b border-gold/20 shadow-2xl' : 'py-6 bg-gradient-to-b from-navy/90 to-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gold no-underline text-xl font-bold tracking-widest heading-font drop-shadow-[0_0_6px_rgba(201,148,58,0.5)]">
            <span>⛵</span> BUILD <span className="text-white">THE ARK</span>
          </Link>

          <ul className="hidden md:flex list-none gap-8">
            <li><Link href="#home" className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font">Home</Link></li>
            <li><Link href="#story" className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font">The Story</Link></li>
            <li><Link href="#donate" className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font">Give</Link></li>
            <li><Link href="#about" className="text-white hover:text-gold no-underline text-sm tracking-wider uppercase transition-colors heading-font">About</Link></li>
            <li><a href="#donate" className="btn btn-primary px-6 py-2.5 text-xs">Donate Now</a></li>
          </ul>

          <button
            className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1 bg-transparent border-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] bg-[#F5EDD8] transition-all duration-300 ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 right-0 z-40 bg-navy/95 border-b border-gold/20 backdrop-blur-xl px-10 pt-8 pb-10 flex flex-col gap-0 transition-all duration-300 md:hidden ${menuOpen ? 'top-[70px] opacity-100 pointer-events-auto' : '-top-full opacity-0 pointer-events-none'}`}
      >
        <Link href="#home" onClick={() => setMenuOpen(false)} className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2">Home</Link>
        <Link href="#story" onClick={() => setMenuOpen(false)} className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2">The Story</Link>
        <Link href="#donate" onClick={() => setMenuOpen(false)} className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2">Give</Link>
        <Link href="#about" onClick={() => setMenuOpen(false)} className="font-cinzel text-sm font-semibold tracking-widest text-cream/75 no-underline py-4 border-b border-gold/10 transition-all hover:text-gold hover:pl-2">About</Link>
        <a href="#donate" onClick={() => setMenuOpen(false)} className="btn btn-primary mt-6 text-center text-xs py-3 w-full animate-bounce">Donate Now</a>
      </div>
    </>
  );
}
