"use server";

import { redirect } from "next/navigation";

import { cedulaToEmail, normalizeCedula } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const cedula = normalizeCedula(String(formData.get("cedula") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (cedula.length < 6) {
    return { error: "Ingresa una cédula válida (sin puntos ni guiones)." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return {
      error:
        "El sistema aún no está conectado a Supabase. Configura .env.local.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: cedulaToEmail(cedula),
    password,
  });

  if (error) {
    return { error: "Cédula o contraseña incorrecta." };
  }

  redirect("/panel");
}

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Sin Supabase configurado no hay sesión que cerrar.
  }
  redirect("/login");
}
