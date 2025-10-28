import { prisma } from "@/lib/prisma"

export default async function Page() {
    const proyectos = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Proyectos</h1>
            {proyectos.length === 0 ? (
                <p>No hay proyectos aún.</p>
            ) : (
                <ul className="space-y-2">
                    {proyectos.map((p) => (
                        <li key={p.id} className="border-b pb-2">
                            <strong>{p.title}</strong>
                            {p.location && <> — {p.location}</>}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
