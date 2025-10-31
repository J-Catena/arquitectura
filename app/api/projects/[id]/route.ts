import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ Obtener un proyecto por ID
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const numId = Number(id)

        if (isNaN(numId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        const project = await prisma.project.findUnique({
            where: { id: numId },
            include: {
                gallery: {
                    orderBy: { id: "asc" }, // 🔹 Mantenemos orden consistente
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: "No existe" }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("❌ Error en GET /api/projects/[id]:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// ✅ Editar proyecto existente
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const numId = Number(id)

        if (isNaN(numId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        const exists = await prisma.project.findUnique({ where: { id: numId } })
        if (!exists) {
            return NextResponse.json({ error: "No existe" }, { status: 404 })
        }

        const body = await req.json()
        const { title, description, location, coverImage, headerImage, gallery } = body ?? {}

        // 🧠 Generar slug si cambia el título
        const slug = title
            ? title
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^\w\-]+/g, "")
            : exists.slug

        // 🔹 Filtramos URLs válidas
        const filteredGallery =
            Array.isArray(gallery) && gallery.length
                ? gallery.filter((url: string) => !!url && url.trim() !== "")
                : []

        // 🔹 Actualizamos proyecto + galería
        const updated = await prisma.project.update({
            where: { id: numId },
            data: {
                title: title ?? exists.title,
                description: description ?? exists.description,
                location: location ?? exists.location,
                coverImage: coverImage ?? exists.coverImage,
                headerImage: headerImage ?? exists.headerImage,
                slug,
                updatedAt: new Date(),
                gallery: {
                    deleteMany: {}, // elimina imágenes previas
                    ...(filteredGallery.length > 0 && {
                        create: filteredGallery.map((url: string) => ({ url })),
                    }),
                },
            },
            include: {
                gallery: {
                    orderBy: { id: "asc" },
                },
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("❌ Error en PUT /api/projects/[id]:", error)
        return NextResponse.json(
            { error: "Error actualizando proyecto" },
            { status: 500 }
        )
    }
}

// ✅ Eliminar proyecto (y su galería)
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const numId = Number(id)

        if (isNaN(numId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        // Prisma eliminará automáticamente la galería si definiste onDelete: Cascade,
        // pero lo dejamos explícito por claridad:
        await prisma.galleryImage.deleteMany({ where: { projectId: numId } })
        await prisma.project.delete({ where: { id: numId } })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("❌ Error en DELETE /api/projects/[id]:", error)
        return NextResponse.json(
            { error: "Error eliminando proyecto" },
            { status: 500 }
        )
    }
}
