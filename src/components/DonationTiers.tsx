"use client";

import { useState } from 'react';
import { useNotifications } from './NotificationProvider';

interface Tier {
    id: number;
    icon: string;
    name: string;
    price: number;
    available: number;
    description: string;
    features: string;
    isPopular: boolean;
}

export default function DonationTiers({ tiers }: { tiers: Tier[] }) {
    const { triggerDonation } = useNotifications();
    const [customAmount, setCustomAmount] = useState<string>('');
    const [loading, setLoading] = useState<number | string | null>(null);

    const handleDonate = async (amount: number, id: number | string) => {
        if (amount <= 0) return;
        setLoading(id);
        await triggerDonation(amount);
        // Reset loading after a delay to show success
        setTimeout(() => {
            setLoading(null);
            if (id === 'custom') setCustomAmount('');
        }, 1500);
    };

    return (
        <section id="donate" className="py-24">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
                <span className="text-gold tracking-[2px] text-sm font-semibold uppercase block mb-6 heading-font">CHOOSE YOUR PLANK</span>
                <h2 className="text-[3rem] leading-[1.1] mb-5 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">EVERY GIFT BUILDS<br />SOMETHING ETERNAL</h2>
                <p className="text-text-muted text-[1.1rem] max-w-[600px] mx-auto mb-12">Select the level of giving that speaks to your heart. Each tier places another piece of the Ark into place.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

                    {tiers.map((tier) => {
                        let features: string[] = [];
                        try {
                            const parsed = JSON.parse(tier.features || '[]');
                            features = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            features = [];
                        }

                        const isCurrentlyLoading = loading === tier.id;

                        return (
                            <div key={tier.id} className={`bg-navy-light text-left relative flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 rounded-lg p-10 pb-8 ${tier.isPopular ? 'border border-gold-dark shadow-[0_0_20px_rgba(223,178,93,0.2)]' : 'border border-navy-border'}`}>
                                {tier.isPopular && <div className="absolute top-0 right-6 -translate-y-1/2 bg-gold text-navy font-bold text-[0.7rem] px-3 py-1 tracking-wider rounded heading-font">MOST POPULAR</div>}

                                <div className="text-3xl mb-4 text-gold">{tier.icon}</div>
                                <div className="text-gold text-xs uppercase tracking-wider mb-1 heading-font">{tier.name}</div>
                                <h3 className="text-5xl leading-none mb-1">${tier.price}</h3>
                                <p className="text-xs text-text-muted mb-6">{tier.available} Available</p>
                                <p className="text-sm text-text-muted mb-6 min-h-[60px]">{tier.description}</p>

                                <ul className="list-none mb-8 flex-grow space-y-3">
                                    {features.map((feature: string, idx: number) => (
                                        <li key={idx} className="relative pl-5 text-sm text-slate-300 before:content-['•'] before:absolute before:left-0 before:text-gold">{feature}</li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleDonate(tier.price, tier.id)}
                                    disabled={loading !== null}
                                    className={`btn mt-auto w-full transition-all duration-300 ${isCurrentlyLoading ? 'bg-green-600 scale-95' : tier.isPopular ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {isCurrentlyLoading ? 'THANK YOU! ❤️' : `GIVE $${tier.price}`}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Custom Amount */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-navy-light p-6 rounded-lg border border-navy-border max-w-[600px] mx-auto">
                    <span className="heading-font tracking-wider text-text-muted">CUSTOM AMOUNT</span>
                    <div className="relative flex items-center">
                        <span className="absolute left-3 text-white heading-font text-xl">$</span>
                        <input
                            type="number"
                            placeholder="0"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="bg-black/30 border border-navy-border rounded py-3 pl-8 pr-3 text-white heading-font text-xl w-[150px] outline-none focus:border-gold transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => handleDonate(Number(customAmount), 'custom')}
                        disabled={loading !== null || !customAmount}
                        className={`btn min-w-[140px] transition-all duration-300 ${loading === 'custom' ? 'bg-green-600' : 'btn-primary'}`}
                    >
                        {loading === 'custom' ? 'THANK YOU!' : 'GIVE NOW →'}
                    </button>
                </div>
            </div>
        </section>
    );
}
