import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProyectoDetalle({ params }: Props) {
    const { slug } = await params;

    const project = await prisma.project.findFirst({
        where: { slug },
        include: { gallery: true },
    });

    if (!project) return notFound();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-24 space-y-16 sm:space-y-20 font-[Inter]">
            {/* 🏗️ Imagen de cabecera */}
            {project.headerImage && (
                <section>
                    <img
                        src={project.headerImage}
                        alt={project.title}
                        className="w-full h-[420px] sm:h-[520px] md:h-[680px] object-cover rounded-3xl shadow-lg"
                    />
                </section>
            )}

            {/* 🏗️ Título y descripción */}
            <section className="text-left max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight">
                    {project.title}
                </h1>

                {project.location && (
                    <p className="text-gray-500 text-lg mb-6">{project.location}</p>
                )}

                {project.description && (
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                        {project.description}
                    </p>
                )}
            </section>

            {/* 🖼️ Imagen de portada */}
            {project.coverImage && (
                <section className="mt-10">
                    <img
                        src={project.coverImage}
                        alt={`Portada de ${project.title}`}
                        className="w-full h-[380px] sm:h-[480px] md:h-[600px] object-cover rounded-2xl shadow-md transition-transform duration-500 hover:scale-[1.01]"
                    />
                </section>
            )}

            {/* 🏗️ Galería */}
            {project.gallery.length > 0 && (
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                        Galería del proyecto
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {project.gallery.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={`${project.title} imagen ${img.id}`}
                                className="rounded-2xl object-cover w-full h-[240px] sm:h-[300px] md:h-[360px] hover:scale-[1.03] transition-transform duration-500 shadow-sm"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 🏗️ CTA final */}
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
                    src="/cta.jpg"
                    alt="Arquitectura"
                    className="mt-10 md:mt-0 md:w-[380px] rounded-2xl object-cover shadow-md"
                />
            </section>
        </main>
    );
}
