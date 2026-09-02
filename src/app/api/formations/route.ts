import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Endpoint consommé par l'app Kotlin.
 * Utilise le client "utilisateur" (pas le client admin) : la RLS
 * décide seule de ce qui est renvoyé selon le token envoyé par l'app.
 */
export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("modules")
    .select("id, title, slug, description, filiere, niveau")
    .eq("published", true)
    .order("title");

  if (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ data });
}