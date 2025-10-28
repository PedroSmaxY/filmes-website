"use client";

import { useState } from "react";
import { z } from "zod";
import { CustomerRequestDTO } from "../lib/api";

interface CustomerFormProps {
  onSubmit: (data: CustomerRequestDTO) => void;
  loading: boolean;
}

const customerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(5, "Telefone inválido"),
});

export default function CustomerForm({ onSubmit, loading }: CustomerFormProps) {
  const [form, setForm] = useState<CustomerRequestDTO>({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = customerSchema.parse(form);
      onSubmit(data);
      setForm({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
        />
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:col-span-2"
          placeholder="Telefone"
          value={form.phone}
          onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          {loading ? "Salvando..." : "Adicionar Cliente"}
        </button>
      </div>
    </form>
  );
}
