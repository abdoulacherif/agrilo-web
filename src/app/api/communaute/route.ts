import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const sujetSchema = z.object({
  titre: z.string().trim().min(3).max(150),
  contenu: z.string().trim().min(1).max(5000),
});

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sujets")
    .select("id, titre, contenu, auteur_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = sujetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // auteur_id pris du token authentifié, jamais du body envoyé par
  // l'app — impossible de publier un sujet au nom de quelqu'un d'autre.
  const { error } = await supabase.from("sujets").insert({
    titre: parsed.data.titre,
    contenu: parsed.data.contenu,
    auteur_id: user.id,
  });

  if (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}