export default function NotFound() {
    return (
        <main className="mx-auto max-w-3xl p-6 text-center">
            <h1 className="text-2xl font-semibold mb-2">Proyecto no encontrado</h1>
            <p className="text-gray-600 mb-4">
                El proyecto que estás buscando no existe o fue eliminado.
            </p>
            <a href="/proyectos" className="underline text-blue-600">
                ← Volver a proyectos
            </a>
        </main>
    )
}
