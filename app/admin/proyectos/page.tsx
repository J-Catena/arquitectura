"use client"

import { useState } from "react"

export default function Page() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage("")

        try {
            if (!image) {
                setMessage("Por favor, selecciona una imagen")
                setUploading(false)
                return
            }

            // 1️⃣ Subimos la imagen a Cloudinary
            const formData = new FormData()
            formData.append("file", image)

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.error || "Error subiendo imagen")

            console.log("✅ Imagen subida con éxito:", uploadData.secure_url)

            // 2️⃣ Guardamos el proyecto en la base de datos
            const saveRes = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl: uploadData.secure_url, // 👈 importante, coincide con la API
                }),
            })

            if (!saveRes.ok) {
                const error = await saveRes.json()
                throw new Error(error.error || "Error guardando proyecto en la base de datos")
            }

            const savedProject = await saveRes.json()
            console.log("💾 Proyecto guardado:", savedProject)

            setMessage("✅ Proyecto subido correctamente")
            setTitle("")
            setDescription("")
            setImage(null)
        } catch (err: any) {
            console.error(err)
            setMessage("❌ Error al subir el proyecto")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Subir nuevo proyecto</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {uploading ? "Subiendo..." : "Subir proyecto"}
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </div>
    )
}
