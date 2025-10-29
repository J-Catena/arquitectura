import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 })

        const buffer = Buffer.from(await file.arrayBuffer())
        const base64 = buffer.toString("base64")

        const upload = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
            folder: "arquitectura",
        })

        return NextResponse.json({ secure_url: upload.secure_url })
    } catch (error) {
        console.error("Error en Cloudinary:", error)
        return NextResponse.json({ error: "Error subiendo imagen" }, { status: 500 })
    }
}
