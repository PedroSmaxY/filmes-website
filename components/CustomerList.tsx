"use client";

import { Customer } from "../lib/api";

interface CustomerListProps {
  customers: Customer[];
  onDelete: (customerId: number) => void;
}

export default function CustomerList({
  customers,
  onDelete,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="p-3 text-sm text-zinc-500">Nenhum cliente ainda.</div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {customers.map((customer) => (
        <div
          key={customer.id}
          className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-zinc-900"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{customer.name}</p>
            <p className="truncate text-xs text-zinc-500">
              {customer.email} • {customer.phone}
            </p>
          </div>
          <button
            onClick={() => onDelete(customer.id)}
            className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
