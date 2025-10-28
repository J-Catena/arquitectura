export default function Loading() {
    return (
        <main className="mx-auto max-w-3xl p-6 animate-pulse">
            <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
            <div className="h-64 w-full bg-gray-200 rounded-2xl mb-6" />
            <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
        </main>
    )
}
