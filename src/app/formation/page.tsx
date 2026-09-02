import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FormationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, slug, description, filiere, niveau")
    .eq("published", true)
    .order("title");

  return (
    <main>
      <h1>Catalogue des formations</h1>
      <div className="grid3">
        {(modules ?? []).map((m) => (
          <a key={m.id} href={`/formations/${m.slug}`} className="mcard">
            <span className="tag">{m.filiere}</span>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <div className="meta">
              <span>{m.niveau}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}