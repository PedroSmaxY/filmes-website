"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import {
  BASE_URL,
  createCustomer,
  createMovie,
  createRental,
  Customer,
  CustomerRequestDTO,
  decreaseCopies,
  deleteCustomer,
  deleteMovie,
  getCustomers,
  getEmployees,
  getMovies,
  getRentals,
  increaseCopies,
  Movie,
  MovieRequestDTO,
  RentalResponseDTO,
  Employee,
  returnRental,
  ApiError,
} from "../lib/api";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [movieForm, setMovieForm] = useState<MovieRequestDTO>({
    title: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    availableCopies: 1,
    director: "",
  });

  const [customerForm, setCustomerForm] = useState<CustomerRequestDTO>({
    name: "",
    email: "",
    phone: "",
  });

  const [rentalForm, setRentalForm] = useState<{
    customerId: number;
    movieId: number;
    employeeId: number;
  }>({
    customerId: 0,
    movieId: 0,
    employeeId: 1,
  });
  const [returnId, setReturnId] = useState<number>(0);
  const [rentals, setRentals] = useState<RentalResponseDTO[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const hasData = useMemo(
    () => movies.length > 0 || customers.length > 0,
    [movies, customers]
  );

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [m, c, r, e] = await Promise.all([
        getMovies(),
        getCustomers(),
        getRentals(),
        getEmployees(),
      ]);
      setMovies(m);
      setCustomers(c);
      setRentals(r);
      setEmployees(e);
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateMovie() {
    setLoading(true);
    setError(null);
    try {
      const schema = z.object({
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
      const body = schema.parse(movieForm);
      await createMovie(body);
      setMovieForm({
        title: "",
        genre: "",
        releaseYear: new Date().getFullYear(),
        availableCopies: 1,
        director: "",
      });
      await loadAll();
      toast.success("Filme criado");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao criar filme");
      toast.error(msg || "Erro ao criar filme");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCustomer() {
    setLoading(true);
    setError(null);
    try {
      const schema = z.object({
        name: z.string().min(1, "Nome obrigatório"),
        email: z.string().email("Email inválido"),
        phone: z.string().min(5, "Telefone inválido"),
      });
      const body = schema.parse(customerForm);
      await createCustomer(body);
      setCustomerForm({ name: "", email: "", phone: "" });
      await loadAll();
      toast.success("Cliente criado");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao criar cliente");
      toast.error(msg || "Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRental() {
    setLoading(true);
    setError(null);
    try {
      const schema = z.object({
        customerId: z.number().int().min(1, "Selecione um cliente"),
        movieId: z.number().int().min(1, "Selecione um filme"),
        employeeId: z.number().int().min(1, "Informe o ID do empregado"),
      });
      const body = schema.parse(rentalForm);
      await createRental(body);
      await loadAll();
      toast.success("Aluguel criado");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao criar aluguel");
      toast.error(msg || "Erro ao criar aluguel");
    } finally {
      setLoading(false);
    }
  }

  async function handleReturnRental() {
    if (!returnId) return;
    setLoading(true);
    setError(null);
    try {
      await returnRental(returnId);
      setReturnId(0);
      await loadAll();
      toast.success("Aluguel devolvido");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao devolver aluguel");
      toast.error(msg || "Erro ao devolver aluguel");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMovie(movieId: number) {
    if (!confirm("Tem certeza que deseja deletar este filme?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteMovie(movieId);
      await loadAll();
      toast.success("Filme deletado");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao deletar filme");
      toast.error(msg || "Erro ao deletar filme");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCustomer(customerId: number) {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteCustomer(customerId);
      await loadAll();
      toast.success("Cliente deletado");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao deletar cliente");
      toast.error(msg || "Erro ao deletar cliente");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjustCopies(movieId: number, delta: number) {
    setLoading(true);
    setError(null);
    try {
      const movie = movies.find((m) => m.id === movieId);
      if (!movie) throw new Error("Filme não encontrado");
      if (delta < 0) {
        const maxDecrease = Math.min(Math.abs(delta), movie.availableCopies);
        if (movie.availableCopies === 0 || maxDecrease === 0) {
          toast.error("Não é possível reduzir abaixo de 0 cópias");
          return;
        }
        await decreaseCopies(movieId, maxDecrease);
      } else if (delta > 0) {
        await increaseCopies(movieId, delta);
      }
      await loadAll();
      toast.success("Cópias atualizadas");
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || "Erro ao ajustar cópias");
      toast.error(msg || "Erro ao ajustar cópias");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-5xl p-6">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-semibold tracking-tight">
          Locadora de Filmes
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Conectado em {BASE_URL}
        </p>

        {error ? (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-medium">Filmes</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Título"
                  value={movieForm.title}
                  onChange={(e) =>
                    setMovieForm((s) => ({ ...s, title: e.target.value }))
                  }
                />
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Gênero"
                  value={movieForm.genre}
                  onChange={(e) =>
                    setMovieForm((s) => ({ ...s, genre: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Ano de lançamento"
                  value={movieForm.releaseYear}
                  min={1888}
                  max={new Date().getFullYear()}
                  step={1}
                  onChange={(e) =>
                    setMovieForm((s) => ({
                      ...s,
                      releaseYear: Number(e.target.value || 0),
                    }))
                  }
                />
                <input
                  type="number"
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Cópias disponíveis"
                  value={movieForm.availableCopies}
                  min={0}
                  step={1}
                  onChange={(e) =>
                    setMovieForm((s) => ({
                      ...s,
                      availableCopies: Math.max(0, Number(e.target.value || 0)),
                    }))
                  }
                />
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:col-span-2"
                  placeholder="Diretor"
                  value={movieForm.director}
                  onChange={(e) =>
                    setMovieForm((s) => ({ ...s, director: e.target.value }))
                  }
                />
                <button
                  onClick={handleCreateMovie}
                  disabled={loading}
                  className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
                >
                  {loading ? "Salvando..." : "Adicionar Filme"}
                </button>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Lista
                </h3>
                <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                  {movies.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {m.title}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {m.genre} • {m.releaseYear} • Cópias:{" "}
                          {m.availableCopies}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustCopies(m.id, 1)}
                          className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjustCopies(m.id, -1)}
                          className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(m.id)}
                          className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  {movies.length === 0 && (
                    <div className="p-3 text-sm text-zinc-500">
                      Nenhum filme ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-medium">Clientes</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Nome"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm((s) => ({ ...s, name: e.target.value }))
                  }
                />
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Email"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm((s) => ({ ...s, email: e.target.value }))
                  }
                />
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 sm:col-span-2"
                  placeholder="Telefone"
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm((s) => ({ ...s, phone: e.target.value }))
                  }
                />
                <button
                  onClick={handleCreateCustomer}
                  disabled={loading}
                  className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
                >
                  {loading ? "Salvando..." : "Adicionar Cliente"}
                </button>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Lista
                </h3>
                <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                  {customers.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.name}</p>
                        <p className="truncate text-xs text-zinc-500">
                          {c.email} • {c.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  {customers.length === 0 && (
                    <div className="p-3 text-sm text-zinc-500">
                      Nenhum cliente ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:col-span-2">
            <h2 className="mb-4 text-xl font-medium">Aluguéis</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <select
                className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                value={rentalForm.customerId}
                onChange={(e) =>
                  setRentalForm((s) => ({
                    ...s,
                    customerId: Number(e.target.value),
                  }))
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
                value={rentalForm.movieId}
                onChange={(e) =>
                  setRentalForm((s) => ({
                    ...s,
                    movieId: Number(e.target.value),
                  }))
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
                value={rentalForm.employeeId}
                onChange={(e) =>
                  setRentalForm((s) => ({
                    ...s,
                    employeeId: Number(e.target.value),
                  }))
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
                onClick={handleCreateRental}
                disabled={
                  loading || !rentalForm.customerId || !rentalForm.movieId
                }
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
                onClick={handleReturnRental}
                disabled={loading || !returnId}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Devolver
              </button>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                Aluguéis Ativos
              </h3>
              <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {rentals
                  .filter((r) => r.status === "OPEN")
                  .map((r) => {
                    const movie = movies.find((m) => m.id === r.movieId);
                    const customer = customers.find(
                      (c) => c.id === r.customerId
                    );
                    const employee = employees.find(
                      (e) => e.id === r.employeeId
                    );

                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {movie?.title || `Filme #${r.movieId}`} -{" "}
                            {customer?.name || `Cliente #${r.customerId}`}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            Alugado em:{" "}
                            {new Date(r.rentalDate).toLocaleDateString()} •
                            Processado por:{" "}
                            {employee?.name || `Funcionário #${r.employeeId}`} •
                            ID: {r.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                            {r.status}
                          </span>
                          <button
                            onClick={() => setReturnId(r.id)}
                            className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            Devolver
                          </button>
                        </div>
                      </div>
                    );
                  })}
                {rentals.filter((r) => r.status === "OPEN").length === 0 && (
                  <div className="p-3 text-sm text-zinc-500">
                    Nenhum aluguel ativo.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                Aluguéis Finalizados
              </h3>
              <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {rentals
                  .filter((r) => r.status === "RETURNED")
                  .map((r) => {
                    const movie = movies.find((m) => m.id === r.movieId);
                    const customer = customers.find(
                      (c) => c.id === r.customerId
                    );
                    const employee = employees.find(
                      (e) => e.id === r.employeeId
                    );

                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {movie?.title || `Filme #${r.movieId}`} -{" "}
                            {customer?.name || `Cliente #${r.customerId}`}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            Alugado em:{" "}
                            {new Date(r.rentalDate).toLocaleDateString()} •
                            Devolvido em:{" "}
                            {r.returnDate
                              ? new Date(r.returnDate).toLocaleDateString()
                              : "N/A"}{" "}
                            • Processado por:{" "}
                            {employee?.name || `Funcionário #${r.employeeId}`} •
                            ID: {r.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            {r.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {rentals.filter((r) => r.status === "RETURNED").length ===
                  0 && (
                  <div className="p-3 text-sm text-zinc-500">
                    Nenhum aluguel finalizado.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {!hasData && !loading ? (
          <p className="mt-6 text-sm text-zinc-500">
            Sem dados ainda. Cadastre filmes e clientes para começar.
          </p>
        ) : null}
      </main>
    </div>
  );
}
