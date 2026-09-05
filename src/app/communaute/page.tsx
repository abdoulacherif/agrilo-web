import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CommunautePage() {
  const supabase = await createServerSupabaseClient();

  const { data: sujets } = await supabase
    .from("sujets")
    .select("id, titre, contenu, created_at")
    .order("created_at", { ascending: false });

  return (
    <main>
      <h1>Communauté</h1>
      <p>Questions et échanges entre agriculteurs, éleveurs et étudiants.</p>

      <ul>
        {(sujets ?? []).map((s) => (
          <li key={s.id}>
            <a href={`/communaute/${s.id}`}>
              <h3>{s.titre}</h3>
              <p>{s.contenu.slice(0, 120)}...</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}