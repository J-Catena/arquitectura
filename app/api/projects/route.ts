import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { title, description, imageUrl } = await req.json()

        if (!title || !imageUrl) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
        }

        const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")

        const newProject = await prisma.project.create({
            data: { title, description, image: imageUrl, slug },
        })

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

export async function GET() {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(projects)
}
