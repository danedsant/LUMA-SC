export type Rol = "ADMIN" | "VECINO" | "CONTADOR";

export type Perfil = {
  auth_uid: string;
  cedula: string;
  rol: Rol;
  apto_id: string | null;
  activo: boolean;
};

export type Apto = {
  id: string;
  codigo: string;
  piso: number;
  tipo: "apartamento" | "planta_baja";
  balcon: boolean;
  alicuota: number;
  estado: "ocupado" | "vacio";
  activo: boolean;
};

export type Persona = {
  cedula: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
};

export type ReciboCondominio = {
  id: string;
  apto_id: string;
  periodo_id: string;
  saldo_anterior_usd: number;
  cuota_usd: number;
  monto_ajustado_usd: number | null;
  pagos_usd: number;
  saldo_actual_usd: number;
  provisional: boolean;
};

export type Pago = {
  id: string;
  apto_id: string | null;
  local_id: string | null;
  periodo_id: string | null;
  concepto: "condominio" | "gas" | "local" | "especial";
  monto_bs: number;
  tasa_bcv: number;
  monto_usd: number;
  fecha_pago: string;
  metodo: "transferencia" | "efectivo" | "cruce" | "descuento" | "otro";
  referencia: string | null;
  estado: "pendiente" | "validado" | "rechazado" | "devuelto" | "sin_asignar";
};

export type CuotaGas = {
  id: string;
  apto_id: string;
  periodo_gas_id: string;
  monto_usd: number;
  monto_bs: number;
  pagado_usd: number;
  estado: "pendiente" | "parcial" | "pagada" | "exenta" | "cuenta_por_cobrar";
};

export type Anuncio = {
  id: string;
  titulo: string;
  cuerpo: string;
  adjunto_path: string | null;
  fecha_publicacion: string | null;
  estado: "borrador" | "publicado" | "archivado";
};

export type Incidencia = {
  id: string;
  apto_id: string | null;
  reportante_id: string | null;
  es_anonimo: boolean;
  categoria: string | null;
  ubicacion: string | null;
  descripcion: string;
  foto_path: string | null;
  estado: "pendiente" | "en_proceso" | "resuelto" | "cerrado";
  asignado_a: string | null;
};
