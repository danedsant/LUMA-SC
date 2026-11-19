import { createBrowserClient } from "@supabase/ssr";

import {
  assertSupabaseConfigured,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  assertSupabaseConfigured();
  browserClient ??= createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
