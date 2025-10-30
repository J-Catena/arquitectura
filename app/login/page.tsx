"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Credenciales incorrectas. Inténtalo de nuevo.")
        } else {
            router.push("/admin/proyectos")
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white shadow-md rounded-2xl p-8 border border-gray-100">
                <h1 className="text-2xl font-semibold mb-6 text-center tracking-tight">
                    Acceso administrativo
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="tuemail@estudio.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition"
                    >
                        Entrar
                    </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-6">
                    © {new Date().getFullYear()} Alvaro Camacho — Arquitecto
                </p>
            </div>
        </main>
    )
}
