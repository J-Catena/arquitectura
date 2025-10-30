import { prisma } from "@/lib/prisma"
import Link from "next/link"

// 🔹 Mostramos solo los proyectos más recientes (o destacados si se desea)
export default async function HomePage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 3, // mostramos los 3 últimos proyectos
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero principal */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Shaping the Future <br />
            <span className="text-gray-500">of Architecture</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Where innovation, design, and creativity unite to create timeless architectural experiences.
          </p>
          <Link
            href="/proyectos"
            className="inline-block border border-gray-900 px-5 py-2 text-sm uppercase tracking-wide hover:bg-gray-900 hover:text-white transition"
          >
            Ver proyectos
          </Link>
        </div>

        {/* Imagen principal del hero */}
        <div className="rounded-xl overflow-hidden shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero img.png"
            alt="Arquitectura moderna"
            className="object-cover w-full h-[380px]"
          />
        </div>
      </section>

      {/* Sección de proyectos destacados */}
      <section>
        <h2 className="text-2xl font-medium mb-8">Proyectos destacados</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">Aún no hay proyectos publicados.</p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.slug}`}
                className="group block overflow-hidden rounded-xl relative"
              >
                <img
                  src={project.image ?? "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <p className="text-sm opacity-90">{project.location ?? ""}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA final */}
        <section className="flex flex-col md:flex-row items-center justify-between pt-16 gap-10">
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
      </section>
    </main>
  )
}
