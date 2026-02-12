import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ProyectoDetalle({ params }: Props) {
    const { slug } = await params

    const project = await prisma.project.findFirst({
        where: { slug },
        include: { gallery: { orderBy: { order: "asc" } } },
    })

    if (!project) return notFound()

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24 font-[Inter] space-y-20">

            {/* 🧩 Bloque principal: título + logo */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-gray-200 pb-12">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">
                        {project.title}
                    </h1>

                    {project.location && (
                        <p className="text-gray-600 text-lg mb-6">{project.location}</p>
                    )}

                    {project.description && (
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                            {project.description}
                        </p>
                    )}
                </div>

                {project.headerImage && (
                    <div className="flex justify-center md:justify-end">
                        <img
                            src={project.headerImage}
                            alt={project.title}
                            className="w-full max-w-md object-contain rounded-xl shadow-sm"
                        />
                    </div>
                )}
            </section>

            {/* 🏗️ Imagen de portada */}
            {project.coverImage && (
                <section>
                    <img
                        src={project.coverImage}
                        alt={`Portada de ${project.title}`}
                        className="w-full h-[400px] sm:h-[520px] object-cover rounded-3xl shadow-lg transition-transform duration-500 hover:scale-[1.01]"
                    />
                </section>
            )}

            {/* 📖 Descripción extendida (2 columnas) */}
            {project.description && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700 text-base leading-relaxed">
                    <p>
                        {project.description}
                    </p>
                    <p>
                        Este proyecto explora la relación entre la forma arquitectónica y su entorno,
                        buscando un equilibrio entre estructura, paisaje y funcionalidad.
                    </p>
                </section>
            )}

            {/* 🖼️ Galería */}
            {project.gallery.length > 0 && (
                <section>
                    <h2 className="text-2xl font-semibold mb-8 text-gray-900 border-b border-gray-200 pb-3">
                        Galería del proyecto
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {project.gallery.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={`${project.title} imagen ${img.id}`}
                                className="rounded-2xl object-cover w-full h-[280px] md:h-[340px] hover:scale-[1.02] transition-transform duration-500 shadow-sm"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* CTA final */}
            <section className="flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-3xl p-10 md:p-16 shadow-sm">
                <div className="max-w-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                        Trabaja con nosotros
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Nos apasiona diseñar espacios que transforman la manera en que las
                        personas viven, trabajan y se relacionan con su entorno. Si tienes
                        un proyecto en mente, hablemos.
                    </p>
                    <a
                        href="/contacto"
                        className="inline-block border border-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-black hover:text-white transition-all"
                    >
                        Contactar
                    </a>
                </div>

                <img
                    src="/work-with-us.png"
                    alt="Arquitectura"
                    className="mt-10 md:mt-0 md:w-[380px] rounded-2xl object-cover shadow-md"
                />
            </section>
        </main>
    )
}
