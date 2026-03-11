import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const trends = await prisma.trendPoint.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(trends);
    } catch (error) {
        console.error('Fetch trends error:', error);
        return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();

        // Simple implementation: delete all and recreate for simplicity in bulk updates
        // In a real app we'd upsert, but for sync charts this is common
        await prisma.trendPoint.deleteMany({});
        const created = await prisma.trendPoint.createMany({
            data: data.map((point: any) => ({
                type: point.type,
                label: point.label,
                value1: Number(point.value1),
                value2: point.value2 ? Number(point.value2) : null,
                order: Number(point.order)
            }))
        });

        return NextResponse.json(created);
    } catch (error) {
        console.error('Update trends error:', error);
        return NextResponse.json({ error: 'Failed to update trends' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const created = await prisma.trendPoint.create({
            data: {
                type: data.type,
                label: data.label,
                value1: Number(data.value1),
                value2: data.value2 ? Number(data.value2) : null,
                order: Number(data.order)
            }
        });
        return NextResponse.json(created);
    } catch (error) {
        console.error('Create trend error:', error);
        return NextResponse.json({ error: 'Failed to create trend' }, { status: 500 });
    }
}
