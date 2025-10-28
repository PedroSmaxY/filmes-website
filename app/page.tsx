"use client";

import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { BASE_URL } from "../lib/api";
import { useApi } from "../hooks/useApi";
import MovieForm from "../components/MovieForm";
import CustomerForm from "../components/CustomerForm";
import MovieList from "../components/MovieList";
import CustomerList from "../components/CustomerList";
import RentalForm from "../components/RentalForm";
import RentalList from "../components/RentalList";

export default function Home() {
  const {
    movies,
    customers,
    rentals,
    employees,
    loading,
    error,
    createMovie,
    createCustomer,
    createRental,
    deleteMovie,
    deleteCustomer,
    returnRental,
    adjustCopies,
  } = useApi();

  const hasData = useMemo(
    () => movies.length > 0 || customers.length > 0,
    [movies, customers]
  );

  const handleDeleteMovie = (movieId: number) => {
    if (confirm("Tem certeza que deseja deletar este filme?")) {
      deleteMovie(movieId);
    }
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      deleteCustomer(customerId);
    }
  };

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
              <MovieForm onSubmit={createMovie} loading={loading} />
              <div className="mt-4">
                <h3 className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Lista
                </h3>
                <MovieList
                  movies={movies}
                  onAdjustCopies={adjustCopies}
                  onDelete={handleDeleteMovie}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-medium">Clientes</h2>
            <div className="space-y-3">
              <CustomerForm onSubmit={createCustomer} loading={loading} />
              <div className="mt-4">
                <h3 className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Lista
                </h3>
                <CustomerList
                  customers={customers}
                  onDelete={handleDeleteCustomer}
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:col-span-2">
            <h2 className="mb-4 text-xl font-medium">Aluguéis</h2>
            <RentalForm
              movies={movies}
              customers={customers}
              employees={employees}
              onSubmit={createRental}
              onReturn={returnRental}
              loading={loading}
            />

            <div className="mt-6">
              <h3 className="mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                Aluguéis Ativos
              </h3>
              <RentalList
                rentals={rentals}
                movies={movies}
                customers={customers}
                employees={employees}
                onReturn={returnRental}
                status="OPEN"
                title="Aluguéis Ativos"
              />
            </div>

            <div className="mt-6">
              <h3 className="mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                Aluguéis Finalizados
              </h3>
              <RentalList
                rentals={rentals}
                movies={movies}
                customers={customers}
                employees={employees}
                onReturn={returnRental}
                status="RETURNED"
                title="Aluguéis Finalizados"
              />
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
