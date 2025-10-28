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
            setError("Credenciales incorrectas")
        } else {
            router.push("/admin/proyectos")
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-80"
            >
                <h1 className="text-2xl font-semibold mb-6 text-center">Iniciar sesión</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-xl p-2 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full border rounded-xl p-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-black text-white rounded-xl py-2 hover:bg-gray-800"
                >
                    Entrar
                </button>
            </form>
        </main>
    )
}
