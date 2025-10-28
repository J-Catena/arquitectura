import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ✅ Genera metadatos dinámicos para SEO
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const project = await prisma.project.findUnique({
        where: { slug: params.slug },
        select: { title: true, description: true },
    })

    if (!project) {
        return {
            title: 'Proyecto no encontrado | Arquitectura',
            description: 'El proyecto solicitado no existe o fue eliminado.',
        }
    }

    return {
        title: `${project.title} | Proyectos de Arquitectura`,
        description: project.description?.slice(0, 150),
    }
}

// ✅ Página principal del detalle del proyecto
export default async function ProyectoDetalle({
    params,
}: {
    params: { slug: string }
}) {
    const project = await prisma.project.findUnique({
        where: { slug: params.slug },
    })

    if (!project) return notFound()

    return (
        <main className="mx-auto max-w-3xl p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">{project.title}</h1>
                <p className="text-sm text-gray-500 mt-1">/{project.slug}</p>
            </header>

            {project.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={project.image}
                    alt={project.title}
                    className="mb-6 w-full rounded-2xl object-cover max-h-[420px]"
                />
            )}

            {project.description ? (
                <article className="prose prose-neutral max-w-none">
                    <p>{project.description}</p>
                </article>
            ) : (
                <p className="text-gray-500">Sin descripción.</p>
            )}

            <footer className="mt-10">
                <a
                    href="/proyectos"
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Volver al listado
                </a>
            </footer>
        </main>
    )
}
