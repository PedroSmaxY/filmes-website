"use client";

import { useState } from "react";
import { z } from "zod";
import { RentalRequestDTO, Movie, Customer, Employee } from "../lib/api";

interface RentalFormProps {
  movies: Movie[];
  customers: Customer[];
  employees: Employee[];
  onSubmit: (data: RentalRequestDTO) => void;
  onReturn: (rentalId: number) => void;
  loading: boolean;
}

const rentalSchema = z.object({
  customerId: z.number().int().min(1, "Selecione um cliente"),
  movieId: z.number().int().min(1, "Selecione um filme"),
  employeeId: z.number().int().min(1, "Selecione um funcionário"),
});

export default function RentalForm({
  movies,
  customers,
  employees,
  onSubmit,
  onReturn,
  loading,
}: RentalFormProps) {
  const [form, setForm] = useState<RentalRequestDTO>({
    customerId: 0,
    movieId: 0,
    employeeId: 1,
  });
  const [returnId, setReturnId] = useState<number>(0);

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = rentalSchema.parse(form);
      onSubmit(data);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleReturn = () => {
    if (returnId) {
      onReturn(returnId);
      setReturnId(0);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreateRental}
        className="grid grid-cols-1 gap-3 sm:grid-cols-4"
      >
        <select
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          value={form.customerId}
          onChange={(e) =>
            setForm((s) => ({ ...s, customerId: Number(e.target.value) }))
          }
        >
          <option value={0}>Cliente</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (#{c.id})
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          value={form.movieId}
          onChange={(e) =>
            setForm((s) => ({ ...s, movieId: Number(e.target.value) }))
          }
        >
          <option value={0}>Filme</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} (#{m.id})
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          value={form.employeeId}
          onChange={(e) =>
            setForm((s) => ({ ...s, employeeId: Number(e.target.value) }))
          }
        >
          <option value={0}>Funcionário</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} (#{e.id})
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || !form.customerId || !form.movieId}
          className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
        >
          Criar Aluguel
        </button>

        <div className="sm:col-span-3" />
        <input
          type="number"
          className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          placeholder="ID do aluguel para devolução"
          value={returnId || ""}
          min={1}
          step={1}
          onChange={(e) =>
            setReturnId(Math.max(0, Number(e.target.value || 0)))
          }
        />
        <button
          type="button"
          onClick={handleReturn}
          disabled={loading || !returnId}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Devolver
        </button>
      </form>
    </div>
  );
}
