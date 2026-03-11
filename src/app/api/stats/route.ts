import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const stats = await prisma.stat.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, value, label } = body;

        const stat = await prisma.stat.update({
            where: { id: Number(id) },
            data: {
                value,
                label
            }
        });

        return NextResponse.json(stat);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
    }
}
