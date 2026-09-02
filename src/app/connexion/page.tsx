import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function signIn(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/connexion?error=champs_manquants");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Message générique volontaire : ne pas révéler si c'est l'email
    // ou le mot de passe qui est incorrect (évite l'énumération de comptes).
    redirect("/connexion?error=identifiants_invalides");
  }

  redirect("/profil");
}

export default function ConnexionPage() {
  return (
    <main>
      <h1>Connexion</h1>
      <form action={signIn}>
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
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="btn-primary">
          Se connecter
        </button>
      </form>
    </main>
  );
}