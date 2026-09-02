import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { roleUpdateSchema } from "@/lib/validations/module";
import { revalidatePath } from "next/cache";

async function updateRole(formData: FormData) {
  "use server";

  const admin = await requireAdmin();

  const parsed = roleUpdateSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) throw new Error("Requête invalide");

  // Un admin ne peut pas se retirer lui-même son propre rôle admin par
  // erreur (ça éviterait de se retrouver sans aucun admin sur la plateforme).
  if (parsed.data.userId === admin.id && parsed.data.role !== "admin") {
    throw new Error("Impossible de modifier son propre rôle admin ici");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) throw new Error("Mise à jour du rôle impossible");

  revalidatePath("/admin/utilisateurs");
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(users ?? []).map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <form action={updateRole}>
                  <input type="hidden" name="userId" value={u.id} />
                  <select name="role" defaultValue={u.role}>
                    <option value="apprenant">Apprenant</option>
                    <option value="formateur">Formateur</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit">Mettre à jour</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}