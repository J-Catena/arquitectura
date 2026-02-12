"use client";

import { useState } from "react";

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "loading" });

    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot simple anti-spam: si viene relleno => bot
    if ((data.get("company") ?? "").toString().trim().length > 0) {
      setState({ status: "success", message: "Mensaje enviado." });
      form.reset();
      return;
    }

    const payload = {
      name: (data.get("name") ?? "").toString(),
      email: (data.get("email") ?? "").toString(),
      phone: (data.get("phone") ?? "").toString(),
      message: (data.get("message") ?? "").toString(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setState({
          status: "error",
          message: json?.error ?? "No se pudo enviar el mensaje.",
        });
        return;
      }

      setState({
        status: "success",
        message: "Recibido. Te responderé lo antes posible.",
      });
      form.reset();
    } catch {
      setState({ status: "error", message: "Error de red. Intenta de nuevo." });
    }
  }

  const disabled = state.status === "loading";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Nombre</label>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          className="mt-1 w-full rounded-md border px-3 py-2"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          name="email"
          type="email"
          required
          maxLength={120}
          className="mt-1 w-full rounded-md border px-3 py-2"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm">Teléfono (opcional)</label>
        <input
          name="phone"
          maxLength={40}
          className="mt-1 w-full rounded-md border px-3 py-2"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="block text-sm">Mensaje</label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          className="mt-1 w-full rounded-md border px-3 py-2"
          disabled={disabled}
        />
      </div>

      {/* honeypot (no debe verse) */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={disabled}
        className="rounded-md border px-4 py-2"
      >
        {disabled ? "Enviando..." : "Enviar"}
      </button>

      {state.status === "success" && (
        <p className="text-sm">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="text-sm">{state.message}</p>
      )}
    </form>
  );
}