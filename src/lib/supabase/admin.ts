import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getServiceRoleKey, supabaseUrl } from "@/lib/env";

/**
 * Cliente con `service_role`: solo se usa en scripts de importación,
 * verificación y rutas de servidor. Nunca debe importarse en el cliente.
 */
export function createAdminClient() {
  if (!supabaseUrl) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
  }

  return createSupabaseClient(supabaseUrl, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
