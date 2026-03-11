import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, name } = body;

        // 1. Create the donation record
        const donation = await prisma.donation.create({
            data: {
                amount: parseFloat(amount),
                name: name || "A generous donor"
            }
        });

        // 2. Increment the total raised in settings
        // Assuming id: 1 exists from seed
        await prisma.siteSettings.update({
            where: { id: 1 },
            data: {
                raised: {
                    increment: parseFloat(amount)
                }
            }
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error('Donation error:', error);
        return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
    }
}
