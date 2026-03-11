import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { raised, goal, heroTitle, heroSubtitle, heroText } = body;

        // We assume setting id=1 always exists because of the seed
        const settings = await prisma.siteSettings.update({
            where: { id: 1 },
            data: {
                raised: raised ? parseFloat(raised) : undefined,
                goal: goal ? parseFloat(goal) : undefined,
                heroTitle,
                heroSubtitle,
                heroText
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
