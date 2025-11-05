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
  // Formato brasileiro com 11 dígitos: (11) 99999-9999
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/u, "Telefone no formato (11) 99999-9999"),
});

export default function CustomerForm({ onSubmit, loading }: CustomerFormProps) {
  const [form, setForm] = useState<CustomerRequestDTO>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Mascara e normalização do telefone para (11) 99999-9999
  const formatPhoneBR = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const ddd = digits.slice(0, 2);
    const firstPart = digits.slice(2, 7);
    const lastPart = digits.slice(7, 11);
    let formatted = "";
    if (ddd) formatted = `(${ddd}`;
    if (digits.length >= 2) formatted += ")";
    if (firstPart) formatted += ` ${firstPart}`;
    if (lastPart) formatted += `-${lastPart}`;
    return formatted;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = customerSchema.parse(form);
      onSubmit(data);
      setForm({ name: "", email: "", phone: "" });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {
          name?: string;
          email?: string;
          phone?: string;
        } = {};
        for (const issue of error.issues) {
          const field = issue.path[0] as keyof CustomerRequestDTO | undefined;
          if (field) fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        console.error("Validation error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Nome"
          aria-label="Nome"
          required
          value={form.name}
          onChange={(e) => {
            setForm((s) => ({ ...s, name: e.target.value }));
            if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
          }}
        />
        {errors.name && (
          <p className="text-xs text-red-600 sm:col-span-2">{errors.name}</p>
        )}
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          type="email"
          placeholder="Email"
          aria-label="Email"
          required
          value={form.email}
          onChange={(e) => {
            setForm((s) => ({ ...s, email: e.target.value }));
            if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
          }}
        />
        {errors.email && (
          <p className="text-xs text-red-600 sm:col-span-2">{errors.email}</p>
        )}
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:col-span-2"
          type="tel"
          inputMode="numeric"
          placeholder="(11) 99999-9999"
          aria-label="Telefone"
          pattern="\(\d{2}\) \d{5}-\d{4}"
          maxLength={15}
          value={form.phone}
          onChange={(e) => {
            const formatted = formatPhoneBR(e.target.value);
            setForm((s) => ({ ...s, phone: formatted }));
            if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
          }}
        />
        {errors.phone && (
          <p className="text-xs text-red-600 sm:col-span-2">{errors.phone}</p>
        )}
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
