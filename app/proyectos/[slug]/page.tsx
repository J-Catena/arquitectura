import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProyectoDetalle({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    if (!slug || typeof slug !== "string") {
        return notFound()
    }

    const project = await prisma.project.findUnique({
        where: { slug },
    })

    if (!project) return notFound()

    return (
        <main className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

            {project.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full rounded-lg mb-6"
                />
            )}

            <p className="text-gray-700 mb-2">{project.description}</p>
            {project.location && (
                <p className="text-gray-500 text-sm">📍 {project.location}</p>
            )}
        </main>
    )
}
