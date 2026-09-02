import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Un compte créé via ce formulaire est TOUJOURS "apprenant".
// Le rôle "admin" ou "formateur" ne peut être attribué que par un
// admin existant depuis /admin/utilisateurs — jamais à l'inscription.
const signUpSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "8 caractères minimum"),
});

async function signUp(formData: FormData) {
  "use server";

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/inscription?error=formulaire_invalide");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect("/inscription?error=inscription_impossible");
  }

  redirect("/connexion?message=verifiez_votre_email");
}

export default function InscriptionPage() {
  return (
    <main>
      <h1>Créer un compte</h1>
      <form action={signUp}>
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="btn-primary">
          S&apos;inscrire
        </button>
      </form>
    </main>
  );
}