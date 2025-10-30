import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { signOut } from "next-auth/react"
import DeleteButton from "./DeleteButton"
import SignOutButton from "./SignOutButton"



export default async function AdminProyectosPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <main className="max-w-6xl mx-auto p-6">
            {/* Header superior */}
            <header className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-semibold">Panel de administración</h1>
                    <p className="text-gray-500">
                        Bienvenido, <span className="font-medium">{session.user?.name}</span>
                    </p>
                </div>

                <form
                    action={async () => {
                        "use server"
                        const { signOut } = await import("next-auth/react")
                        await signOut({ redirect: true, callbackUrl: "/" })
                    }}
                >
                    <button
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Cerrar sesión
                    </button>
                </form>
            </header>

            {/* Botón de nuevo proyecto */}
            <div className="flex justify-end mb-6">
                <Link
                    href="/admin/proyectos/nuevo"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    + Nuevo proyecto
                </Link>
            </div>

            {/* Lista de proyectos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="
        flex flex-col justify-between
        border border-gray-200
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-md
        transition-shadow
        bg-white
        h-[460px]
      "
                    >
                        {/* Imagen */}
                        <div className="w-full h-56 overflow-hidden">
                            <img
                                src={p.image || "/placeholder.jpg"}
                                alt={p.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 flex flex-col justify-between p-5">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                    {p.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {p.description}
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="mt-5 border-t pt-4 flex justify-between items-center">
                                <div className="flex gap-3">
                                    <Link
                                        href={`/admin/proyectos/edit/${p.id}`}
                                        className="
                bg-gray-100
                text-gray-800
                px-4 py-1.5
                rounded-lg
                text-sm
                font-medium
                hover:bg-gray-200
                transition
              "
                                    >
                                        Editar
                                    </Link>

                                    <Link
                                        href={`/proyectos/${p.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                bg-black
                text-white
                px-4 py-1.5
                rounded-lg
                text-sm
                font-medium
                hover:bg-gray-800
                transition
              "
                                    >
                                        Ver proyecto
                                    </Link>
                                </div>

                                <DeleteButton id={p.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {projects.length === 0 && (
                <p className="text-gray-500 text-center mt-20">
                    No hay proyectos aún. ¡Crea el primero!
                </p>
            )}
        </main>
    )
}
