import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProyectosPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 font-[Inter]">
            {/*  Encabezado */}
            <section className="text-center mb-16 md:mb-24">
                <h1 className="text-4xl md:text-6xl font-semibold mb-4 tracking-tight">
                    Proyectos
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Una selección de obras que reflejan nuestro compromiso con la
                    arquitectura contemporánea, la sostenibilidad y la experiencia
                    espacial.
                </p>
            </section>

            {/*  Grid de proyectos */}
            {projects.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Aún no hay proyectos publicados.
                </p>
            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/proyectos/${project.slug}`}
                            className="group block rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            {/* Imagen de portada */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={project.coverImage || "/placeholder.jpg"}
                                alt={project.title}
                                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />

                            {/* Contenido */}
                            <div className="p-6 bg-white">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-gray-700 transition">
                                    {project.title}
                                </h3>
                                {project.location && (
                                    <p className="text-gray-500 text-sm">{project.location}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </section>
            )}

            {/* CTA final */}
            <section className="mt-24 flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-3xl p-10 md:p-16 shadow-sm">
                <div className="max-w-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                        ¿Tienes un proyecto en mente?
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Nos especializamos en diseñar espacios que responden a las
                        necesidades del cliente, el entorno y la función. Trabajemos juntos
                        para dar forma a tu idea.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-block border border-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-black hover:text-white transition-all"
                    >
                        Contactar
                    </Link>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/work-with-us.png"
                    alt="Arquitectura"
                    className="mt-10 md:mt-0 md:w-[380px] rounded-2xl object-cover shadow-md"
                />
            </section>
        </main>
    )
}
