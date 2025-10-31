"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditProjectPage() {
    const router = useRouter()
    const { id } = useParams()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>("")
    const [headerImage, setHeaderImage] = useState<File | null>(null)
    const [headerPreview, setHeaderPreview] = useState<string>("")
    const [gallery, setGallery] = useState<File[]>([])
    const [galleryPreview, setGalleryPreview] = useState<string[]>([])
    const [existingGallery, setExistingGallery] = useState<string[]>([])

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
            setCoverPreview(data.coverImage || "")
            setHeaderPreview(data.headerImage || "")
            setExistingGallery(data.gallery?.map((g: any) => g.url) || [])
        }
        if (id) fetchProject()
    }, [id])

    // 🔹 Subir archivos a Cloudinary
    const uploadToCloudinary = async (files: File | File[]) => {
        const formData = new FormData()
        if (Array.isArray(files)) files.forEach((f) => formData.append("file", f))
        else formData.append("file", files)

        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al subir imagen")
        return data
    }

    // 🔹 Eliminar imagen existente (solo visualmente)
    const handleRemoveExistingImage = (url: string) => {
        setExistingGallery((prev) => prev.filter((img) => img !== url))
    }

    // 🔹 Eliminar imagen nueva (no subida aún)
    const handleRemoveNewImage = (index: number) => {
        setGallery((prev) => prev.filter((_, i) => i !== index))
        setGalleryPreview((prev) => prev.filter((_, i) => i !== index))
    }

    // 🔹 Guardar cambios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        setMessage("")

        try {
            let coverUrl = coverPreview
            let headerUrl = headerPreview
            let galleryUrls: string[] = []

            if (coverImage) {
                const upload = await uploadToCloudinary(coverImage)
                coverUrl = upload.secure_url
            }

            if (headerImage) {
                const upload = await uploadToCloudinary(headerImage)
                headerUrl = upload.secure_url
            }

            if (gallery.length > 0) {
                const upload = await uploadToCloudinary(gallery)
                galleryUrls = Array.isArray(upload)
                    ? upload.map((img) => img.secure_url)
                    : [upload.secure_url]
            }

            // ✅ Combinamos las imágenes existentes + nuevas
            const updatedGallery = [
                ...existingGallery,
                ...galleryUrls.filter(Boolean),
            ]

            // 🔹 Enviar datos al backend
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    coverImage: coverUrl,
                    headerImage: headerUrl,
                    gallery: updatedGallery,
                }),
            })

            if (!res.ok) throw new Error("Error actualizando el proyecto")

            setMessage("✅ Proyecto actualizado correctamente")
            setTimeout(() => router.push("/admin/proyectos"), 1500)
        } catch (err: any) {
            console.error(err)
            setMessage("❌ " + (err.message || "Error al guardar los cambios"))
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 font-[Inter]">
            <h1 className="text-3xl font-semibold mb-8 tracking-tight">
                Editar Proyecto
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
                        rows={5}
                    />
                </div>

                {/* 🖋️ Portada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen de portada
                    </label>
                    {coverPreview && (
                        <img
                            src={coverPreview}
                            alt="Portada"
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
                    />
                </div>

                {/* 🏗️ Cabecera */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen de cabecera
                    </label>
                    {headerPreview && (
                        <img
                            src={headerPreview}
                            alt="Cabecera"
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

                {/* 📸 Galería existente */}
                {existingGallery.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Galería existente
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {existingGallery.map((src, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={src}
                                        alt={`Imagen ${i}`}
                                        className="rounded-lg object-cover h-28 w-full border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(src)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 📤 Añadir nuevas imágenes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Añadir nuevas imágenes
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            setGallery((prev) => [...prev, ...files])
                            setGalleryPreview((prev) => [
                                ...prev,
                                ...files.map((f) => URL.createObjectURL(f)),
                            ])
                        }}
                    />

                    {galleryPreview.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {galleryPreview.map((src, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={src}
                                        alt={`Nueva ${i}`}
                                        className="rounded-lg object-cover h-28 w-full border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-4 pt-4">
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
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium disabled:opacity-50"
                    >
                        {uploading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>

            {message && <p className="mt-6 text-center text-gray-700">{message}</p>}
        </div>
    )
}
