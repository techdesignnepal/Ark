"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';

interface Donation {
    id: number;
    amount: number;
    name: string;
    createdAt: string;
}

const NotificationContext = createContext({
    triggerDonation: (amount: number, name?: string) => { },
});

export const useNotifications = () => useContext(NotificationContext);

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [latestDonation, setLatestDonation] = useState<Donation | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [lastSeenId, setLastSeenId] = useState<number | null>(null);

    // Function to "fake" or "real" trigger a donation for local feedback
    const triggerDonation = async (amount: number, name?: string) => {
        try {
            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, name }),
            });
            if (res.ok) {
                // We don't manually trigger toast here, 
                // the polling will pick it up for everyone!
            }
        } catch (err) {
            console.error("Donation trigger failed", err);
        }
    };

    // Polling logic
    useEffect(() => {
        const checkLatest = async () => {
            try {
                const res = await fetch('/api/donations/latest');
                if (!res.ok) return;

                const data = await res.json();
                if (!data) return;

                // If it's a new donation we haven't seen yet
                if (lastSeenId === null) {
                    setLastSeenId(data.id); // Initialize
                    return;
                }

                if (data.id > lastSeenId) {
                    setLatestDonation(data);
                    setLastSeenId(data.id);
                    setShowToast(true);

                    // Auto-hide after 6 seconds
                    setTimeout(() => setShowToast(false), 6000);
                }
            } catch (err) {
                // Silent fail for polling
            }
        };

        const interval = setInterval(checkLatest, 8000); // Poll every 8 seconds
        return () => clearInterval(interval);
    }, [lastSeenId]);

    return (
        <NotificationContext.Provider value={{ triggerDonation }}>
            {children}

            {/* Premium Toast UI */}
            <div className={`fixed bottom-8 left-8 z-[9999] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${showToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
                <div className="bg-navy-light border border-gold-dark/50 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(223,178,93,0.1)] rounded-xl p-5 flex items-center gap-4 min-w-[320px] backdrop-blur-xl group overflow-hidden">
                    {/* Animated Gold Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                    <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30 text-2xl flex-shrink-0 animate-pulse-slow">
                        🚢
                    </div>

                    <div className="flex-grow">
                        <div className="text-gold text-[0.65rem] uppercase tracking-[2px] font-bold mb-1 heading-font opacity-80">NEW GIFT RECEIVED</div>
                        <div className="text-white text-lg font-bold leading-tight">
                            <span className="text-gold-light">{latestDonation?.name || "Someone"}</span> just gave <span className="text-gold">${latestDonation?.amount?.toLocaleString()}</span>
                        </div>
                        <div className="text-text-muted text-[0.7rem] mt-1 space-x-2">
                            <span>Building the Ark...</span>
                            <span className="opacity-50">•</span>
                            <span className="opacity-50">Just now</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowToast(false)}
                        className="text-text-muted hover:text-white transition-colors p-2 -mr-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    {/* Progress Bar under toast */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gold transition-all duration-[6000ms] ease-linear" style={{ width: showToast ? '0%' : '100%' }} />
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite ease-in-out;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </NotificationContext.Provider>
    );
}
