interface HeroProps {
    subtitle: string;
    title: string;
    text: string;
}

export default function Hero({ subtitle, title, text }: HeroProps) {
    // Simple check to render "THE ARK" inside the span if title equals "BUILD THE ARK"
    const titleParts = title.split(' ');
    const mainTitle = titleParts[0];
    const spanTitle = titleParts.slice(1).join(' ');

    return (
        <header id="home" className="relative min-h-screen flex items-center justify-center text-center pt-20 overflow-hidden">
            {/* Background Image with Color Modification */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to bottom, #050c16 0%, rgba(7, 18, 32, 0.4) 35%, rgba(7, 18, 32, 0.4) 65%, #071220 100%), url("/ark-bg.jpg") center/cover no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            ></div>

            <div className="relative z-10 max-w-[800px] animate-[fadeIn_1.5s_ease-out] px-6">
                <span className="block text-gold tracking-[3px] text-sm font-semibold uppercase mb-4 heading-font drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {subtitle}
                </span>
                <h1 className="text-[3.5rem] md:text-[5rem] leading-none mb-6 drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)] tracking-[4px]">
                    {mainTitle}<br /><span className="text-[4rem] md:text-[6rem] text-gold">{spanTitle}</span>
                </h1>
                <p className="text-xl text-white/95 mb-10 max-w-[600px] mx-auto italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-medium">
                    {text}
                </p>
                <a href="#donate" className="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    DONATE NOW
                </a>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[0.5rem] z-20 animate-[fadeInUp_0.9s_ease-out_1.4s_both]">
                <div className="w-[1px] h-[50px] bg-gradient-to-b from-gold to-transparent animate-[pl_2s_ease-in-out_infinite]"></div>
            </div>
        </header>
    );
}
