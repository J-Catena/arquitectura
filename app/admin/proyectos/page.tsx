// app/admin/proyectos/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import SignOutButton from "./SignOutButton";

export default async function AdminProyectosPage() {

    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-6xl mx-auto p-6">
            {/* HEADER */}
            <header className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-semibold">Panel de administración</h1>
                    <p className="text-gray-500">Gestión de proyectos</p>
                </div>

                {/* Cierre de sesión (client) */}
                <SignOutButton />
            </header>

            {/* Botón nuevo proyecto */}
            <div className="flex justify-end mb-6">
                <Link
                    href="/admin/proyectos/nuevo"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    + Nuevo proyecto
                </Link>
            </div>

            {/* Lista de proyectos */}
            {projects.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">
                    No hay proyectos aún. Crea el primero.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="flex flex-col justify-between border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white h-[460px]"
                        >
                            {/* Imagen */}
                            <div className="w-full h-56 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.coverImage || "/placeholder.jpg"}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {p.description || "Sin descripción"}
                                    </p>
                                </div>

                                {/* Acciones */}
                                <div className="mt-5 border-t pt-4 flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/admin/proyectos/edit/${p.id}`}
                                            className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                                        >
                                            Editar
                                        </Link>

                                        <Link
                                            href={`/proyectos/${p.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                                        >
                                            Ver
                                        </Link>
                                    </div>

                                    <DeleteButton id={p.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
