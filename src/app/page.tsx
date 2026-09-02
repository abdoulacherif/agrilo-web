import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getFeaturedModules() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("modules")
    .select("id, title, slug, description, filiere, niveau")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Erreur chargement modules:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const modules = await getFeaturedModules();

  return (
    <main>
      <section className="hero">
        <h1>Apprends l&apos;agriculture et l&apos;élevage, à ton rythme.</h1>
        <p>
          Des formations pratiques pensées pour les agriculteurs, les
          éleveurs, les étudiants et toute personne qui veut cultiver ou
          élever mieux.
        </p>
        <a href="/formations" className="btn-primary">
          Explorer les formations
        </a>
      </section>

      <section id="modules">
        <h2>Formations en avant</h2>
        <div className="grid3">
          {modules.map((m) => (
            <a key={m.id} href={`/formations/${m.slug}`} className="mcard">
              <span className="tag">{m.filiere}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
