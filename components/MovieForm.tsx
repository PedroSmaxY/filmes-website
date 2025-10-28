"use client";

import { useState } from "react";
import { z } from "zod";
import { MovieRequestDTO } from "../lib/api";

interface MovieFormProps {
  onSubmit: (data: MovieRequestDTO) => void;
  loading: boolean;
}

const movieSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  genre: z.string().min(1, "Gênero obrigatório"),
  releaseYear: z
    .number()
    .int()
    .min(1888, "Ano inválido")
    .max(new Date().getFullYear(), "Ano no futuro"),
  availableCopies: z.number().int().min(0, "Mínimo 0"),
  director: z.string().min(1, "Diretor obrigatório"),
});

export default function MovieForm({ onSubmit, loading }: MovieFormProps) {
  const [form, setForm] = useState<MovieRequestDTO>({
    title: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    availableCopies: 1,
    director: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = movieSchema.parse(form);
      onSubmit(data);
      setForm({
        title: "",
        genre: "",
        releaseYear: new Date().getFullYear(),
        availableCopies: 1,
        director: "",
      });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
        />
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Gênero"
          value={form.genre}
          onChange={(e) => setForm((s) => ({ ...s, genre: e.target.value }))}
        />
        <input
          type="number"
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Ano de lançamento"
          value={form.releaseYear}
          min={1888}
          max={new Date().getFullYear()}
          step={1}
          onChange={(e) =>
            setForm((s) => ({ ...s, releaseYear: Number(e.target.value || 0) }))
          }
        />
        <input
          type="number"
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="Cópias disponíveis"
          value={form.availableCopies}
          min={0}
          step={1}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              availableCopies: Math.max(0, Number(e.target.value || 0)),
            }))
          }
        />
        <input
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:col-span-2"
          placeholder="Diretor"
          value={form.director}
          onChange={(e) => setForm((s) => ({ ...s, director: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          {loading ? "Salvando..." : "Adicionar Filme"}
        </button>
      </div>
    </form>
  );
}
