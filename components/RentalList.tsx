"use client";

import { RentalResponseDTO, Movie, Customer, Employee } from "../lib/api";

interface RentalListProps {
  rentals: RentalResponseDTO[];
  movies: Movie[];
  customers: Customer[];
  employees: Employee[];
  onReturn: (rentalId: number) => void;
  status: "OPEN" | "RETURNED";
  title: string;
}

export default function RentalList({
  rentals,
  movies,
  customers,
  employees,
  onReturn,
  status,
  title,
}: RentalListProps) {
  const filteredRentals = rentals.filter((r) => r.status === status);

  if (filteredRentals.length === 0) {
    return (
      <div className="p-3 text-sm text-zinc-500">
        {status === "OPEN" ? "Nenhum aluguel ativo." : "Nenhum aluguel finalizado."}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {filteredRentals.map((rental) => {
        const movie = movies.find((m) => m.id === rental.movieId);
        const customer = customers.find((c) => c.id === rental.customerId);
        const employee = employees.find((e) => e.id === rental.employeeId);

        return (
          <div
            key={rental.id}
            className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {movie?.title || `Filme #${rental.movieId}`} -{" "}
                {customer?.name || `Cliente #${rental.customerId}`}
              </p>
              <p className="truncate text-xs text-zinc-500">
                Alugado em: {new Date(rental.rentalDate).toLocaleDateString()} •
                {status === "RETURNED" && (
                  <>
                    Devolvido em:{" "}
                    {rental.returnDate
                      ? new Date(rental.returnDate).toLocaleDateString()
                      : "N/A"}{" "}
                    •
                  </>
                )}
                Processado por:{" "}
                {employee?.name || `Funcionário #${rental.employeeId}`} • ID: {rental.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  status === "OPEN"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {rental.status}
              </span>
              {status === "OPEN" && (
                <button
                  onClick={() => onReturn(rental.id)}
                  className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                >
                  Devolver
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
