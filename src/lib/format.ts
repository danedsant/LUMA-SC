const bsFormatter = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-VE", {
  dateStyle: "medium",
  timeZone: "America/Caracas",
});

export function formatBs(value: number | string | null | undefined): string {
  if (value == null || value === "") return "—";
  return `Bs ${bsFormatter.format(Number(value))}`;
}

export function formatUsd(value: number | string | null | undefined): string {
  if (value == null || value === "") return "—";
  return `$${usdFormatter.format(Number(value))}`;
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}
