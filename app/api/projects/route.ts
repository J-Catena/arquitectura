
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, description, slug, image } = body ?? {}

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'title y slug son obligatorios' },
                { status: 400 }
            )
        }

        const created = await prisma.project.create({
            data: {
                title,
                description: description ?? '',
                slug,
                image,
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (e) {
        return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }
}
