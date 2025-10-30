import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// 🧭 Metadatos generales
export const metadata = {
  title: "Arquitectura — Estudio",
  description: "Portafolio profesional de arquitectura",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-white text-gray-900 tracking-tight antialiased`}
      >
        {/* ✅ HEADER */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="font-semibold text-lg tracking-wide hover:opacity-80 transition"
            >
              <span className="text-gray-900">ALVARO CAMACHO</span>
            </Link>

            <ul className="flex space-x-10 text-[15px] font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-500 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/proyectos"
                  className="hover:text-gray-500 transition-colors duration-200"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-gray-500 transition-colors duration-200"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* ✅ CONTENIDO PRINCIPAL */}
        <main className="min-h-screen">{children}</main>

        {/* ✅ FOOTER */}
        <footer className="border-t border-gray-200 mt-20 py-6 text-sm text-gray-500 text-center">
          <p>
            © {new Date().getFullYear()} Alvaro Camacho — Arquitecto. Todos los derechos reservados.
          </p>

          <p className="mt-2">
            <a
              href="/admin/proyectos"
              className="text-gray-400 hover:text-gray-700 transition text-xs"
            >
              Acceso administrativo
            </a>
          </p>
        </footer>

      </body>
    </html>
  )
}
