import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"

export default async function AdminPage() {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">
                Bienvenido al panel, {session.user?.name}
            </h2>
            <p className="text-gray-600">
                Aquí podrás gestionar tus proyectos y configuración.
            </p>
        </div>
    )
}
