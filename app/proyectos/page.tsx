import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export default async function ProyectosPage() {
    // Obtener proyectos ordenados del más nuevo al más antiguo
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            coverImage: true,
        },
    })

    return (
        <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 font-[Inter]">
            {/* HERO */}
            <section className="mb-24 md:mb-32">
                <div className="max-w-2xl">
                    <h1 className="text-[2.5rem] md:text-[3rem] font-semibold leading-tight mb-4">
                        Shaping the Future <br /> of Architecture
                    </h1>
                    <p className="text-gray-600 text-base leading-relaxed mb-12">
                        Where Innovation, Elegance, and Creativity Unite
                    </p>
                </div>

                <div className="w-full overflow-hidden rounded-3xl shadow-sm">
                    <Image
                        src="/Hero img.png"
                        alt="Arquitectura moderna"
                        width={1200}
                        height={500}
                        className="w-full h-[420px] md:h-[500px] object-cover"
                        priority
                    />
                </div>
            </section>

            {/* LISTADO DE PROYECTOS */}
            <section className="space-y-24 md:space-y-32">
                {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Imagen de portada */}
                            <div className="md:w-1/2 relative group overflow-hidden rounded-2xl shadow-md">
                                <Link href={`/proyectos/${project.slug}`}>
                                    <Image
                                        src={project.coverImage || "/placeholder.jpg"}
                                        alt={project.title}
                                        width={800}
                                        height={500}
                                        className="w-full h-[360px] md:h-[420px] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl"></div>
                                </Link>
                            </div>

                            {/* Información del proyecto */}
                            <div className="md:w-1/2">
                                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                                    {project.title}
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                    {project.description ?? "Sin descripción disponible."}
                                </p>
                                <Link
                                    href={`/proyectos/${project.slug}`}
                                    className="inline-block text-sm font-medium border-b border-gray-800 text-gray-800 hover:text-gray-500 hover:border-gray-500 transition-all"
                                >
                                    Ver proyecto →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-20">
                        No hay proyectos disponibles todavía.
                    </p>
                )}
            </section>

            {/* CTA FINAL */}
            <section className="flex flex-col md:flex-row items-center justify-between mt-32 md:mt-40 border-t border-gray-200 pt-16 gap-10">
                <div className="md:w-1/2">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3">
                        Work with us
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        We’re always open to new projects and creative collaborations.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all"
                    >
                        Contactar
                    </Link>
                </div>

                <div className="md:w-1/2">
                    <Image
                        src="/work-with-us.png"
                        alt="Work with us"
                        width={800}
                        height={400}
                        className="w-full h-[380px] object-cover rounded-2xl shadow-md"
                    />
                </div>
            </section>
        </main>
    )
}
