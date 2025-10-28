export type Movie = {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
  availableCopies: number;
  director: string;
};

export type MovieRequestDTO = {
  title: string;
  genre: string;
  releaseYear: number;
  availableCopies: number;
  director: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type CustomerRequestDTO = {
  name: string;
  email: string;
  phone: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Rental = {
  id: number;
  customer: Customer;
  movie: Movie;
  processedBy: Employee;
  status: "OPEN" | "RETURNED";
  rentalDate: string; // date
  returnDate: string | null; // date
};

export type RentalResponseDTO = {
  id: number;
  movieId: number;
  customerId: number;
  employeeId: number;
  rentalDate: string; // date
  returnDate: string | null; // date
  status: "OPEN" | "RETURNED";
};

export type RentalRequestDTO = {
  customerId: number;
  movieId: number;
  employeeId: number;
};

export const BASE_URL = "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}` as string, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let body: unknown = undefined;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await res.json().catch(() => undefined);
    } else {
      const text = await res.text().catch(() => "");
      body = text || undefined;
    }
    let extracted: string | undefined;
    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>;
      extracted = ["message", "error", "title"]
        .map((k) => record[k])
        .find((v) => typeof v === "string") as string | undefined;
    } else if (typeof body === "string") {
      extracted = body;
    }
    const message = extracted || res.statusText || "Request failed";
    throw new ApiError(message, res.status, body);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as unknown as T;
}

// Movies
export const getMovies = () => http<Movie[]>("/api/movies");
export const getMovieById = (id: number) => http<Movie>(`/api/movies/${id}`);
export const createMovie = (body: MovieRequestDTO) =>
  http<Movie>("/api/movies", { method: "POST", body: JSON.stringify(body) });
export const updateMovie = (id: number, body: MovieRequestDTO) =>
  http<void>(`/api/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteMovie = (id: number) =>
  http<void>(`/api/movies/${id}`, { method: "DELETE" });
export const increaseCopies = (id: number, copies: number) =>
  http<void>(`/api/movies/${id}/increase-copies/${copies}`, {
    method: "PATCH",
  });
export const decreaseCopies = (id: number, copies: number) =>
  http<void>(`/api/movies/${id}/decrease-copies/${copies}`, {
    method: "PATCH",
  });

// Customers (under employees namespace per API)
export const getCustomers = () => http<Customer[]>("/api/employees/customers");
export const createCustomer = (body: CustomerRequestDTO) =>
  http<Customer>("/api/employees/customers", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const getCustomerById = (customerId: number) =>
  http<Customer>(`/api/employees/customers/${customerId}`);
export const updateCustomer = (customerId: number, body: CustomerRequestDTO) =>
  http<void>(`/api/employees/customers/${customerId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteCustomer = (customerId: number) =>
  http<void>(`/api/employees/customers/${customerId}`, { method: "DELETE" });
export const findCustomerByEmail = (email: string) =>
  http<Customer>(`/api/employees/customers/email/${encodeURIComponent(email)}`);
export const findCustomerByPhone = (phone: string) =>
  http<Customer>(`/api/employees/customers/phone/${encodeURIComponent(phone)}`);

// Rentals
export const getRentals = () => http<RentalResponseDTO[]>("/api/rentals");
export const createRental = (body: RentalRequestDTO) =>
  http<Rental>("/api/rentals", { method: "POST", body: JSON.stringify(body) });
export const returnRental = (rentalId: number) =>
  http<Rental>(`/api/rentals/${rentalId}/return`, { method: "PATCH" });

// Employees
export const getEmployees = () => http<Employee[]>("/api/employees");
