import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SujetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: sujet } = await supabase
    .from("sujets")
    .select("id, titre, contenu, created_at")
    .eq("id", id)
    .single();

  if (!sujet) notFound();

  return (
    <main>
      <h1>{sujet.titre}</h1>
      <p>{sujet.contenu}</p>
    </main>
  );
}