import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ✅ Subida de una o varias imágenes
export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const files = formData.getAll("file") as File[]

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No se encontraron archivos" },
                { status: 400 }
            )
        }

        // Límite de 5 MB por archivo (ajustable)
        const MAX_SIZE = 5 * 1024 * 1024

        const uploads = await Promise.all(
            files.map(async (file) => {
                if (file.size > MAX_SIZE) {
                    throw new Error(`El archivo ${file.name} excede los 5MB permitidos`)
                }

                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "arquitectura_projects",
                            transformation: [
                                { quality: "auto:good" },
                                { fetch_format: "auto" },
                            ],
                        },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        // Devuelve un array si hay varias imágenes, o un objeto si hay una
        if (uploads.length === 1) {
            return NextResponse.json(uploads[0])
        } else {
            return NextResponse.json(
                uploads.map((r: any) => ({
                    secure_url: r.secure_url,
                    public_id: r.public_id,
                }))
            )
        }
    } catch (error) {
        console.error("❌ Error subiendo imagen:", error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al subir la imagen a Cloudinary",
            },
            { status: 500 }
        )
    }
}
