import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProyectosPage() {
    // Obtenemos los proyectos desde la base de datos
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    })

    // Tipado inferido automáticamente según los resultados
    type ProjectType = (typeof projects)[number]

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="text-3xl font-semibold mb-6">Proyectos</h1>

            {projects.length === 0 ? (
                <p className="text-gray-600">Aún no hay proyectos registrados.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((p: ProjectType) => (
                        <article
                            key={p.id}
                            className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 bg-white"
                        >
                            <Link href={`/proyectos/${p.slug}`} className="block group">
                                {p.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="mb-3 w-full rounded-xl object-cover h-40 group-hover:opacity-90 transition"
                                    />
                                ) : (
                                    <div className="mb-3 h-40 w-full rounded-xl border grid place-items-center bg-gray-50">
                                        <span className="text-sm text-gray-500">Sin imagen</span>
                                    </div>
                                )}

                                <h2 className="text-lg font-medium text-gray-800 group-hover:underline">
                                    {p.title}
                                </h2>

                                {p.description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                                        {p.description}
                                    </p>
                                )}
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    )
}
