"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NuevoProyecto() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>("")
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage("")

        try {
            if (!image) {
                setMessage("Por favor selecciona una imagen.")
                setUploading(false)
                return
            }

            // 🔹 Subimos la imagen a Cloudinary
            const formData = new FormData()
            formData.append("file", image)

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.error)

            // 🔹 Guardamos el proyecto en la base de datos
            const projectRes = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl: uploadData.secure_url,
                }),
            })

            if (!projectRes.ok) throw new Error("Error guardando el proyecto")

            setMessage("✅ Proyecto creado correctamente")
            setTitle("")
            setDescription("")
            setImage(null)
            setPreview("")

            setTimeout(() => router.push("/admin/proyectos"), 1500)
        } catch (error: any) {
            console.error(error)
            setMessage("❌ Error al subir el proyecto")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 font-[Inter]">
            <h1 className="text-3xl font-semibold mb-8 tracking-tight">
                Nuevo Proyecto
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* TÍTULO */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título del proyecto
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 focus:border-black rounded-xl px-4 py-3 text-gray-800 outline-none transition"
                        placeholder="Ej: Vivienda moderna en Madrid"
                        required
                    />
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 focus:border-black rounded-xl px-4 py-3 text-gray-800 outline-none transition"
                        rows={4}
                        placeholder="Describe brevemente el proyecto..."
                        required
                    />
                </div>

                {/* IMAGEN */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen del proyecto
                    </label>
                    {preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={preview}
                            alt="Vista previa"
                            className="w-full h-56 object-cover rounded-2xl mb-4 border border-gray-200 shadow-sm"
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
                        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-xl cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 hover:file:bg-gray-200 transition"
                        required
                    />
                </div>

                {/* BOTONES */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/proyectos")}
                        className="px-5 py-2.5 rounded-xl border border-black text-black hover:bg-gray-100 transition font-medium"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition font-medium disabled:opacity-50"
                    >
                        {uploading ? "Subiendo..." : "Guardar proyecto"}
                    </button>
                </div>
            </form>

            {message && (
                <p className="mt-6 text-center text-gray-700">{message}</p>
            )}
        </div>
    )
}
