interface Stat {
    id: number;
    value: string;
    label: string;
}

export default function Stats({ stats }: { stats: Stat[] }) {
    return (
        <section id="about" className="py-20 border-t border-white/5 bg-gradient-to-t from-navy to-bg-base">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
                <h2 className="text-[3rem] leading-[1.1] mb-5 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">WHAT YOUR <span className="text-gold">GIFT BUILDS</span></h2>
                <p className="text-text-muted text-[1.1rem] max-w-[600px] mx-auto mb-12">Every dollar is a plank, every frame a builder. Together we are creating a sanctuary that will stand for generations.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.id} className="bg-black/20 p-10 px-5 border border-navy-border rounded-lg">
                            <div className={`heading-font text-5xl mb-2 leading-none ${stat.value.includes('5K+') ? 'text-gold' : 'text-white'}`}>{stat.value}</div>
                            <div className="text-xs tracking-[2px] text-text-muted uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
