import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        const name = (body?.name ?? "").toString().trim();
        const email = (body?.email ?? "").toString().trim().toLowerCase();
        const phone = (body?.phone ?? "").toString().trim();
        const message = (body?.message ?? "").toString().trim();

        if (name.length < 2 || name.length > 80) {
            return NextResponse.json({ error: "Nombre inválido." }, { status: 400 });
        }
        if (!isValidEmail(email) || email.length > 120) {
            return NextResponse.json({ error: "Email inválido." }, { status: 400 });
        }
        if (message.length < 10 || message.length > 2000) {
            return NextResponse.json({ error: "Mensaje inválido." }, { status: 400 });
        }
        if (phone.length > 40) {
            return NextResponse.json({ error: "Teléfono inválido." }, { status: 400 });
        }

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            req.headers.get("x-real-ip") ??
            null;

        const userAgent = req.headers.get("user-agent");

        await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                message,
                ip,
                userAgent: userAgent || null,
            },
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Error interno al procesar el mensaje." },
            { status: 500 }
        );
    }
}