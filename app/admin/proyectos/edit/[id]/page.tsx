"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditProjectPage() {
    const router = useRouter()
    const { id } = useParams()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>("")
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    // 🔹 Cargar datos del proyecto existente
    useEffect(() => {
        async function fetchProject() {
            const res = await fetch(`/api/projects/${id}`)
            if (!res.ok) return
            const data = await res.json()
            setTitle(data.title || "")
            setDescription(data.description || "")
            setPreview(data.image || "")
        }
        if (id) fetchProject()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage("")

        try {
            let imageUrl = preview

            // 🔹 Subir imagen si hay nueva
            if (image) {
                const formData = new FormData()
                formData.append("file", image)

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.error || "Error subiendo imagen")

                imageUrl = uploadData.secure_url
            }

            // 🔹 Actualizar en la base de datos
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, image: imageUrl }),
            })

            if (!res.ok) throw new Error("Error actualizando el proyecto")

            setMessage("✅ Proyecto actualizado correctamente")
            setTimeout(() => router.push("/admin/proyectos"), 1500)
        } catch (err: any) {
            console.error(err)
            setMessage("❌ Error actualizando el proyecto")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Editar Proyecto</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Imagen</label>
                    {preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={preview}
                            alt="Vista previa"
                            className="w-full h-48 object-cover rounded-lg mb-3 border"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setImage(file)
                            if (file) setPreview(URL.createObjectURL(file))
                        }}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/proyectos")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                    >
                        {uploading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    )
}
