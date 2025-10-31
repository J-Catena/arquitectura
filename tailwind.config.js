/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                background: "#ffffff",
                text: {
                    DEFAULT: "#111111",
                    muted: "#6b7280",
                },
                border: "#e5e7eb",
                accent: "#000000",
            },
            container: {
                center: true,
                padding: "1.5rem",
            },
            boxShadow: {
                subtle: "0 2px 8px rgba(0,0,0,0.04)",
                card: "0 4px 16px rgba(0,0,0,0.06)",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        },
    },
    plugins: [],
};
