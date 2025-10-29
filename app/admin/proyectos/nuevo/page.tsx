import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default function NuevoProyectoPage() {
    async function createProject(formData: FormData) {
        "use server" // 🧠 acción del servidor

        const title = formData.get("title")?.toString()
        const description = formData.get("description")?.toString()
        const location = formData.get("location")?.toString()
        const image = formData.get("image")?.toString()

        if (!title) {
            throw new Error("El título es obligatorio")
        }

        await prisma.project.create({
            data: {
                title,
                description,
                location,
                image,
                slug: title.toLowerCase().replace(/\s+/g, "-"),
            },
        })

        redirect("/admin/proyectos")
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Nuevo Proyecto</h1>

            <form action={createProject} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input
                        name="title"
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <textarea
                        name="description"
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Imagen (URL)</label>
                    <input
                        name="image"
                        type="url"
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Guardar proyecto
                </button>
            </form>
        </div>
    )
}
