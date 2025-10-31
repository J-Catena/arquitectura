import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Crear proyecto
export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {
            title,
            description,
            location,
            coverImage,
            headerImage,
            gallery,
            imageUrl,
        }: {
            title?: string
            description?: string
            location?: string
            coverImage?: string | null
            headerImage?: string | null
            gallery?: string[] | null
            imageUrl?: string | null
        } = body ?? {}

        if (!title) {
            return NextResponse.json(
                { error: "El título es obligatorio" },
                { status: 400 }
            )
        }

        const finalCover = (coverImage ?? imageUrl ?? "").trim()
        if (!finalCover) {
            return NextResponse.json(
                { error: "Falta la imagen de portada (coverImage)" },
                { status: 400 }
            )
        }

        // Generar slug y evitar duplicados
        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
        let slug = baseSlug

        let i = 1
        while (await prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${i++}`
        }

        const galleryUrls =
            Array.isArray(gallery) ? gallery.filter((u) => !!u && u.trim() !== "") : []

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                location: location ?? null,
                coverImage: finalCover,
                headerImage: headerImage ?? null,
                slug,
                gallery:
                    galleryUrls.length > 0
                        ? {
                            create: galleryUrls.map((url) => ({ url })),
                        }
                        : undefined,
            },
            include: { gallery: true },
        })

        return NextResponse.json(newProject, { status: 201 })
    } catch (error) {
        console.error("❌ Error en POST /api/projects:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// Listar proyectos
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                gallery: {
                    orderBy: { id: "asc" }, // ✅ corregido — sin 'order'
                },
            },
        })
        return NextResponse.json(projects)
    } catch (error) {
        console.error("❌ Error en GET /api/projects:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
