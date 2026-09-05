import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { moduleSchema } from "@/lib/validations/module";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateModule(id: string, formData: FormData) {
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

  if (!parsed.success) throw new Error("Données invalides");

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("modules")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      filiere: parsed.data.filiere,
      niveau: parsed.data.niveau,
      contenu_html: parsed.data.contenu,
      published: parsed.data.published,
    })
    .eq("id", id);

  if (error) throw new Error("Mise à jour impossible");

  revalidatePath("/admin/modules");
  revalidatePath("/formations");
  redirect("/admin/modules");
}

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("id", id)
    .single();

  if (!module) notFound();

  const updateWithId = updateModule.bind(null, id);

  return (
    <div>
      <h1>Modifier la formation</h1>
      <form action={updateWithId}>
        <input name="title" defaultValue={module.title} required />
        <input name="slug" defaultValue={module.slug} required />
        <textarea name="description" defaultValue={module.description} required />
        <select name="filiere" defaultValue={module.filiere} required>
          <option value="culture">Culture</option>
          <option value="elevage_bovin">Élevage bovin</option>
          <option value="elevage_avicole">Élevage avicole</option>
          <option value="autre">Autre</option>
        </select>
        <select name="niveau" defaultValue={module.niveau} required>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
        <textarea name="contenu" defaultValue={module.contenu_html} required />
        <label>
          <input type="checkbox" name="published" defaultChecked={module.published} /> Publier
        </label>
        <button type="submit" className="btn-primary">
          Enregistrer
        </button>
      </form>
    </div>
  );
}