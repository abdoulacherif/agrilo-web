import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingSchema = z.object({
  key: z.enum(["hero_title", "hero_subtitle", "cta_principal"]),
  value: z.string().trim().max(500),
});

async function updateSetting(formData: FormData) {
  "use server";

  await requireAdmin();

  const parsed = settingSchema.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });
  if (!parsed.success) throw new Error("Donnée invalide");

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: parsed.data.key, value: parsed.data.value });

  if (error) throw new Error("Mise à jour impossible");

  revalidatePath("/");
  revalidatePath("/admin/contenu");
}

export default async function AdminContentPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value");

  const get = (key: string) =>
    settings?.find((s) => s.key === key)?.value ?? "";

  return (
    <div>
      <h1>Contenu du site</h1>
      <form action={updateSetting}>
        <label>
          Titre du hero
          <input type="hidden" name="key" value="hero_title" />
          <input name="value" defaultValue={get("hero_title")} />
        </label>
        <button type="submit" className="btn-primary">
          Enregistrer
        </button>
      </form>
      {/* Répéter le même schéma de formulaire pour hero_subtitle et cta_principal */}
    </div>
  );
}