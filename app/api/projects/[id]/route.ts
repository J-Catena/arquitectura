
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
    const id = Number(params.id)
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ error: 'No existe' }, { status: 404 })
    return NextResponse.json(project)
}

export async function PUT(req: Request, { params }: Params) {
    const id = Number(params.id)
    const exists = await prisma.project.findUnique({ where: { id } })
    if (!exists) return NextResponse.json({ error: 'No existe' }, { status: 404 })

    const body = await req.json()
    const { title, description, slug, image } = body ?? {}
    const updated = await prisma.project.update({
        where: { id },
        data: { title, description, slug, image },
    })
    return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Params) {
    const id = Number(params.id)
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
}
