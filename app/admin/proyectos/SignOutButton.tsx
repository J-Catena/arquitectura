"use client"
import { signOut } from "next-auth/react"

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
                bg-gray-800
                hover:bg-gray-700
                text-white
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                transition
            "
        >
            Cerrar sesión
        </button>
    )
}
