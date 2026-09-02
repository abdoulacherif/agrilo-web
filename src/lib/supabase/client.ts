import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour le navigateur (composants "use client").
 * N'utilise QUE la clé anon publique — toute sécurité repose sur
 * les policies RLS définies côté base, pas sur ce client.
 * Ne jamais importer la clé service_role ici.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}