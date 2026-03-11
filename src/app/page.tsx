import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProgressTracker from '@/components/ProgressTracker';
import DonationTiers from '@/components/DonationTiers';
import Stats from '@/components/Stats';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable static rendering to always show fresh data

export default async function Home() {
  const [rawSettings, tiers, stats] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.donationTier.findMany({ orderBy: { price: 'asc' } }),
    prisma.stat.findMany({ orderBy: { order: 'asc' } })
  ]);

  const settings = rawSettings || {
    raised: 0,
    goal: 100000000,
    heroTitle: "BUILD THE ARK",
    heroSubtitle: "A STORY OF FAITH IN KENTUCKY",
    heroText: "Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time."
  };

  return (
    <main>
      <Navbar />
      <Hero
        subtitle={settings.heroSubtitle}
        title={settings.heroTitle}
        text={settings.heroText}
      />
      <ProgressTracker
        raised={settings.raised}
        goal={settings.goal}
      />
      <DonationTiers tiers={tiers} />
      <Stats stats={stats} />
    </main>
  );
}
