// app/contacto/page.tsx
import ContactForm from "@/app/contacto/ContactForm";

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Contacto</h1>
      <p className="mt-3 text-sm opacity-80">
        Cuéntame brevemente el proyecto y te respondo en 24–48h.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  );
}