"use client"

export default function DeleteButton({ id }: { id: number }) {
    const handleDelete = async () => {
        const confirmed = confirm("¿Seguro que deseas eliminar este proyecto?")
        if (!confirmed) return

        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })

            if (res.ok) {
                alert("✅ Proyecto eliminado correctamente")
                window.location.reload()
            } else {
                alert("❌ Error al eliminar el proyecto")
            }
        } catch (error) {
            console.error(error)
            alert("❌ Error de conexión con el servidor")
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="
                relative
                text-red-500
                hover:text-white
                text-sm
                font-medium
                border border-red-400
                rounded-lg
                px-3
                py-1
                transition-all
                duration-200
                hover:bg-red-500
                focus:outline-none
                focus:ring-2
                focus:ring-red-300
            "
        >
            Eliminar
        </button>
    )
}
