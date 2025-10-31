import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Álvaro Camacho — Arquitectura",
  description: "Portafolio profesional de arquitectura contemporánea",
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
        {/* 🔹 NAVBAR */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-6">
            {/* LOGO / NOMBRE */}
            <Link
              href="/"
              className="text-lg md:text-xl font-semibold tracking-wide hover:opacity-80 transition"
            >
              ALVARO CAMACHO
            </Link>

            {/* ENLACES DE NAVEGACIÓN */}
            <ul className="flex items-center space-x-8 md:space-x-12 text-[15px] font-medium">
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

        {/* 🔹 CONTENIDO PRINCIPAL */}
        <main className="min-h-screen">{children}</main>

        {/* 🔹 FOOTER */}
        <footer className="border-t border-gray-200 mt-24 py-10 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="text-gray-800 font-medium tracking-tight">
              ALVARO CAMACHO
            </p>
            <p className="text-gray-500 mt-2">
              © {new Date().getFullYear()} Álvaro Camacho — Arquitectura. Todos los derechos reservados.
            </p>

            <p className="mt-3">
              <Link
                href="/admin/proyectos"
                className="text-gray-400 hover:text-gray-700 text-xs transition"
              >
                Acceso administrativo
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
