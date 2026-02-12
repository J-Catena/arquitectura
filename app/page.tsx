import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 3, // últimos proyectos
  })

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 font-[Inter]">
      {/*  HERO PRINCIPAL */}
      <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
        <div>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6 text-gray-900 tracking-tight">
            Shaping the Future <br />
            <span className="text-gray-500">of Architecture</span>
          </h1>
          <p className="text-gray-600 mb-10 max-w-md text-lg leading-relaxed">
            Where innovation, design, and creativity unite to create timeless architectural experiences.
          </p>
          <Link
            href="/proyectos"
            className="inline-block border border-black px-6 py-3 rounded-xl text-sm font-medium uppercase tracking-wide hover:bg-black hover:text-white transition-all"
          >
            Ver proyectos
          </Link>
        </div>

        {/* Imagen principal del hero */}
        <div className="rounded-3xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hero img.png"
            alt="Arquitectura moderna"
            className="object-cover w-full h-[420px]"
          />
        </div>
      </section>

      {/*  PROYECTOS DESTACADOS */}
      <section className="mb-24">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 tracking-tight text-gray-900 text-center md:text-left">
          Proyectos destacados
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            Aún no hay proyectos publicados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.slug}`}
                className="group block overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverImage ?? "/placeholder.jpg"}
                  alt={project.title}
                  className="w-full h-[280px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="bg-white p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-gray-700 transition">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-gray-500 text-sm">{project.location}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/*  CTA FINAL */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-3xl p-10 md:p-16 shadow-sm">
        <div className="max-w-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">
            Work with us
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We’re always open to new projects and creative collaborations. Let’s build something extraordinary together.
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
          alt="Work with us"
          className="mt-10 md:mt-0 md:w-[380px] rounded-2xl object-cover shadow-md"
        />
      </section>
    </main>
  )
}
