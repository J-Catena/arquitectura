import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 🔹 Obtener un proyecto por ID
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        // ✅ Aquí esperamos a que se resuelva la promesa
        const { id } = await context.params
        const numId = Number(id)

        if (isNaN(numId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        const project = await prisma.project.findUnique({ where: { id: numId } })
        if (!project) {
            return NextResponse.json({ error: "No existe" }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("❌ Error en GET /api/projects/[id]:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

// 🔹 Editar proyecto existente
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const numId = Number(id)

        const exists = await prisma.project.findUnique({ where: { id: numId } })
        if (!exists) {
            return NextResponse.json({ error: "No existe" }, { status: 404 })
        }

        const body = await req.json()
        const { title, description, image } = body ?? {}

        // 🔹 Generar slug automáticamente si cambia el título
        const slug =
            title
                ? title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")
                : exists.slug

        const updated = await prisma.project.update({
            where: { id: numId },
            data: { title, description, slug, image },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("❌ Error en PUT /api/projects/[id]:", error)
        return NextResponse.json({ error: "Error actualizando proyecto" }, { status: 500 })
    }
}

// 🔹 Eliminar proyecto
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const numId = Number(id)

        await prisma.project.delete({ where: { id: numId } })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("❌ Error en DELETE /api/projects/[id]:", error)
        return NextResponse.json({ error: "Error eliminando proyecto" }, { status: 500 })
    }
}
