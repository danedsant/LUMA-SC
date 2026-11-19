import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  assertSupabaseConfigured,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/env";

export async function createClient() {
  assertSupabaseConfigured();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // En un Server Component no se pueden escribir cookies; el proxy
          // refresca la sesión y vuelve a escribirla.
        }
      },
    },
  });
}
