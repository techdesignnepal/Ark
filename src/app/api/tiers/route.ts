import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const tiers = await prisma.donationTier.findMany({
            orderBy: { price: 'asc' }
        });
        return NextResponse.json(tiers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, icon, name, price, available, description, features, isPopular } = body;

        const tier = await prisma.donationTier.update({
            where: { id: Number(id) },
            data: {
                icon,
                name,
                price: price ? parseFloat(price) : undefined,
                available: available ? parseInt(available) : undefined,
                description,
                features: features ? JSON.stringify(features) : undefined,
                isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
            }
        });

        return NextResponse.json(tier);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
    }
}
