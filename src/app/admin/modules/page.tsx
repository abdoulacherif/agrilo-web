import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { moduleSchema } from "@/lib/validations/module";
import { revalidatePath } from "next/cache";

async function createModule(formData: FormData) {
  "use server";

  await requireAdmin();

  const parsed = moduleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    filiere: formData.get("filiere"),
    niveau: formData.get("niveau"),
    contenu: formData.get("contenu"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error("Données de formation invalides");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("modules").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    filiere: parsed.data.filiere,
    niveau: parsed.data.niveau,
    contenu_html: parsed.data.contenu,
    published: parsed.data.published,
  });

  if (error) throw new Error("Impossible de créer la formation");

  revalidatePath("/admin/modules");
  revalidatePath("/formations");
}

export default async function AdminModulesPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, slug, published")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Formations</h1>

      <form action={createModule}>
        <input name="title" placeholder="Titre" required />
        <input name="slug" placeholder="slug-de-la-formation" required />
        <textarea name="description" placeholder="Description courte" required />
        <select name="filiere" required>
          <option value="culture">Culture</option>
          <option value="elevage_bovin">Élevage bovin</option>
          <option value="elevage_avicole">Élevage avicole</option>
          <option value="autre">Autre</option>
        </select>
        <select name="niveau" required>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
        <textarea name="contenu" placeholder="Contenu (HTML)" required />
        <label>
          <input type="checkbox" name="published" /> Publier
        </label>
        <button type="submit" className="btn-primary">
          Créer la formation
        </button>
      </form>

      <ul>
        {(modules ?? []).map((m) => (
          <li key={m.id}>
            {m.title} — {m.published ? "publié" : "brouillon"}
          </li>
        ))}
      </ul>
    </div>
  );
}