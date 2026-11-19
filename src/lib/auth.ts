export function normalizeCedula(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Supabase Auth exige correo; los vecinos se autentican con cédula y se les
 * asigna un correo sintético interno (D-09).
 */
export function cedulaToEmail(cedula: string): string {
  return `${normalizeCedula(cedula)}@luma.local`;
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Junta / Administración",
  VECINO: "Propietario",
  CONTADOR: "Contador (solo lectura)",
};
