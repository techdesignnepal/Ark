import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Don't cache this

export async function GET() {
    try {
        // Fetch the single most recent donation
        const latest = await prisma.donation.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        if (!latest) {
            return NextResponse.json(null);
        }

        // Return the latest donation
        return NextResponse.json(latest);
    } catch (error) {
        console.error('Fetch latest donation error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
