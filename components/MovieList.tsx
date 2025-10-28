"use client";

import { Movie, Customer } from "../lib/api";

interface MovieListProps {
  movies: Movie[];
  onAdjustCopies: (movieId: number, delta: number) => void;
  onDelete: (movieId: number) => void;
}

export default function MovieList({
  movies,
  onAdjustCopies,
  onDelete,
}: MovieListProps) {
  if (movies.length === 0) {
    return <div className="p-3 text-sm text-zinc-500">Nenhum filme ainda.</div>;
  }

  return (
    <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{movie.title}</p>
            <p className="truncate text-xs text-zinc-500">
              {movie.genre} • {movie.releaseYear} • Cópias:{" "}
              {movie.availableCopies}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdjustCopies(movie.id, 1)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              +1
            </button>
            <button
              onClick={() => onAdjustCopies(movie.id, -1)}
              className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              -1
            </button>
            <button
              onClick={() => onDelete(movie.id)}
              className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
