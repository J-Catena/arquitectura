import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null

                console.log("Intentando iniciar sesión con:", credentials.email)

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })
                console.log("Resultado búsqueda en Prisma:", user)

                if (!user) {
                    console.log("❌ Usuario no encontrado en la base de datos")
                    return null
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                console.log("¿Contraseña válida?", isValid)

                if (!isValid) {
                    console.log("❌ Contraseña incorrecta")
                    return null
                }

                console.log("✅ Login correcto:", user.email)
                return { id: String(user.id), name: user.name, email: user.email }
            }

        }),
    ],
    pages: { signIn: "/login" },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
}

// Handlers para las rutas /api/auth/[...nextauth]
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
