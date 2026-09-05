import { requireUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProfilPage() {
  // requireUser relit la session en base et redirige vers /connexion
  // si personne n'est authentifié — jamais fait confiance à un state client.
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data: progression } = await supabase
    .from("progression")
    .select("module_id, statut, updated_at")
    .eq("user_id", user.id); // la RLS filtre déjà, ceci est explicite

  return (
    <main>
      <h1>Mon profil</h1>
      <p>{user.email}</p>

      <h2>Ma progression</h2>
      <ul>
        {(progression ?? []).map((p) => (
          <li key={p.module_id}>
            Formation {p.module_id} — {p.statut}
          </li>
        ))}
        {(progression ?? []).length === 0 && <li>Aucune formation commencée.</li>}
      </ul>
    </main>
  );
}