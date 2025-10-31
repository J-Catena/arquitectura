"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NuevoProyecto() {
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [headerImage, setHeaderImage] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [gallery, setGallery] = useState<File[]>([])

    const [headerPreview, setHeaderPreview] = useState<string>("")
    const [coverPreview, setCoverPreview] = useState<string>("")
    const [galleryPreview, setGalleryPreview] = useState<string[]>([])

    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage("")

        try {
            if (!title.trim()) throw new Error("El título es obligatorio")
            if (!coverImage) throw new Error("Debes subir una imagen de portada")

            // 🔹 Subida de imágenes a Cloudinary
            const uploadToCloudinary = async (files: File | File[]) => {
                const formData = new FormData()
                if (Array.isArray(files)) {
                    files.forEach((f) => formData.append("file", f))
                } else {
                    formData.append("file", files)
                }

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                const data = await res.json()
                if (!res.ok) throw new Error(data.error || "Error al subir imagen")
                return data
            }

            // 🖼️ Subimos portada y cabecera
            const coverUpload = await uploadToCloudinary(coverImage)
            const headerUpload = headerImage ? await uploadToCloudinary(headerImage) : null

            // 📸 Subimos galería (si hay)
            let galleryUrls: string[] = []
            if (gallery.length > 0) {
                const galleryUpload = await uploadToCloudinary(gallery)
                galleryUrls = Array.isArray(galleryUpload)
                    ? galleryUpload.map((img) => img.secure_url)
                    : [galleryUpload.secure_url]
            }

            // 🔹 Guardamos en la base de datos
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    coverImage: coverUpload.secure_url,
                    headerImage: headerUpload?.secure_url || null,
                    gallery: galleryUrls,
                }),
            })

            if (!res.ok) throw new Error("Error guardando el proyecto")

            setMessage("✅ Proyecto creado correctamente")
            setTimeout(() => router.push("/admin/proyectos"), 1500)
        } catch (err: any) {
            console.error(err)
            setMessage("❌ " + (err.message || "Error al crear el proyecto"))
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 font-[Inter]">
            <h1 className="text-3xl font-semibold mb-8 tracking-tight">
                Nuevo Proyecto
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 🏗️ Título */}
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

                {/* 📝 Descripción */}
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
                    />
                </div>

                {/* 🖋️ Imagen de portada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen de portada
                    </label>
                    {coverPreview && (
                        <img
                            src={coverPreview}
                            alt="Vista previa portada"
                            className="w-full h-56 object-cover rounded-2xl mb-4 border border-gray-200 shadow-sm"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setCoverImage(file)
                            if (file) setCoverPreview(URL.createObjectURL(file))
                        }}
                        required
                    />
                </div>

                {/* 🏗️ Imagen de cabecera */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen de cabecera (opcional)
                    </label>
                    {headerPreview && (
                        <img
                            src={headerPreview}
                            alt="Vista previa cabecera"
                            className="w-full h-56 object-cover rounded-2xl mb-4 border border-gray-200 shadow-sm"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setHeaderImage(file)
                            if (file) setHeaderPreview(URL.createObjectURL(file))
                        }}
                    />
                </div>

                {/* 📸 Galería */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Galería de imágenes
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setGallery(files)
                            setGalleryPreview(files.map((f) => URL.createObjectURL(f)))
                        }}
                    />

                    {galleryPreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {galleryPreview.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Galería ${i}`}
                                    className="rounded-lg object-cover h-28 w-full border shadow-sm"
                                />
                            ))}
                        </div>
                    )}
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

            {message && <p className="mt-6 text-center text-gray-700">{message}</p>}
        </div>
    )
}
