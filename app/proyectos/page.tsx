import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProyectosPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <main className="max-w-6xl mx-auto px-6 py-16">
            {/* HERO */}
            <section className="mb-24">
                {/* Texto alineado a la izquierda */}
                <div className="max-w-2xl">
                    <h1 className="text-[2.5rem] font-semibold leading-tight mb-4">
                        Shaping the Future <br /> of Architecture
                    </h1>
                    <p className="text-gray-600 text-base leading-relaxed mb-12">
                        Where Innovation, Elegance, and Creativity Unite
                    </p>
                </div>

                {/* Imagen hero */}
                <div className="w-full overflow-hidden rounded-xl">
                    <img
                        src="/Hero img.png"
                        alt="Arquitectura moderna"
                        className="w-full h-[420px] md:h-[480px] object-cover"
                    />
                </div>
            </section>



            {/* LISTADO DE PROYECTOS */}
            <section className="space-y-24">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        <div className="md:w-1/2">
                            <Link href={`/proyectos/${project.slug}`}>
                                <img
                                    src={project.image ?? "/placeholder.jpg"}
                                    alt={project.title}
                                    className="w-full h-[360px] object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                                />
                            </Link>
                        </div>

                        <div className="md:w-1/2">
                            <h2 className="text-2xl font-semibold mb-3">{project.title}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {project.description ?? "Sin descripción disponible."}
                            </p>
                            <Link
                                href={`/proyectos/${project.slug}`}
                                className="text-sm font-medium text-gray-800 border-b border-gray-800 hover:text-gray-500 transition"
                            >
                                Ver proyecto →
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA FINAL */}
            <section className="flex flex-col md:flex-row items-center justify-between mt-24 border-t pt-16 gap-10">
                <div className="md:w-1/2">
                    <h3 className="text-xl font-semibold mb-3">Work with us</h3>
                    <p className="text-gray-600 mb-6">
                        We’re always open to new projects and creative collaborations.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Contactar
                    </Link>
                </div>

                <div className="md:w-1/2">
                    <img
                        src="/work-with-us.png"
                        alt="Work with us"
                        className="w-full h-[380px] object-cover rounded-xl"
                    />
                </div>
            </section>
        </main>
    )
}
