import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const progressionSchema = z.object({
  moduleId: z.string().uuid(),
  statut: z.enum(["en_cours", "termine"]),
});

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data, error } = await supabase
    .from("progression")
    .select("module_id, statut, updated_at")
    .eq("user_id", user.id); // redondant avec la RLS, mais explicite et sûr

  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = progressionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // user_id forcé à l'utilisateur du token — jamais pris depuis le body,
  // sinon n'importe qui pourrait écrire la progression d'un autre.
  const { error } = await supabase.from("progression").upsert({
    user_id: user.id,
    module_id: parsed.data.moduleId,
    statut: parsed.data.statut,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ ok: true });
}