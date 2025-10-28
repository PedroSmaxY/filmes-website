import { useState, useEffect } from "react";
import {
  getMovies,
  getCustomers,
  getRentals,
  getEmployees,
  createMovie,
  createCustomer,
  createRental,
  deleteMovie,
  deleteCustomer,
  increaseCopies,
  decreaseCopies,
  returnRental,
  Movie,
  Customer,
  RentalResponseDTO,
  Employee,
  MovieRequestDTO,
  CustomerRequestDTO,
  RentalRequestDTO,
  ApiError,
} from "../lib/api";
import toast from "react-hot-toast";

export function useApi() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rentals, setRentals] = useState<RentalResponseDTO[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
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
  };

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    successMessage: string,
    errorMessage: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await apiCall();
      await loadAll();
      toast.success(successMessage);
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? `${e.status}: ${e.message}`
          : (e as Error)?.message;
      setError(msg || errorMessage);
      toast.error(msg || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createMovieHandler = (data: MovieRequestDTO) =>
    handleApiCall(
      () => createMovie(data),
      "Filme criado",
      "Erro ao criar filme"
    );

  const createCustomerHandler = (data: CustomerRequestDTO) =>
    handleApiCall(
      () => createCustomer(data),
      "Cliente criado",
      "Erro ao criar cliente"
    );

  const createRentalHandler = (data: RentalRequestDTO) =>
    handleApiCall(
      () => createRental(data),
      "Aluguel criado",
      "Erro ao criar aluguel"
    );

  const deleteMovieHandler = (id: number) =>
    handleApiCall(
      () => deleteMovie(id),
      "Filme deletado",
      "Erro ao deletar filme"
    );

  const deleteCustomerHandler = (id: number) =>
    handleApiCall(
      () => deleteCustomer(id),
      "Cliente deletado",
      "Erro ao deletar cliente"
    );

  const returnRentalHandler = (id: number) =>
    handleApiCall(
      () => returnRental(id),
      "Aluguel devolvido",
      "Erro ao devolver aluguel"
    );

  const adjustCopiesHandler = async (movieId: number, delta: number) => {
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
  };

  useEffect(() => {
    loadAll();
  }, []);

  return {
    movies,
    customers,
    rentals,
    employees,
    loading,
    error,
    createMovie: createMovieHandler,
    createCustomer: createCustomerHandler,
    createRental: createRentalHandler,
    deleteMovie: deleteMovieHandler,
    deleteCustomer: deleteCustomerHandler,
    returnRental: returnRentalHandler,
    adjustCopies: adjustCopiesHandler,
    loadAll,
  };
}
