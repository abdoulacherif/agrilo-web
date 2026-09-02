import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!module) notFound();

  return (
    <main>
      <span className="tag">{module.filiere}</span>
      <h1>{module.title}</h1>
      <p>{module.description}</p>
      {/* Le contenu vient de l'admin, mais on ne fait jamais confiance
          à du HTML stocké en base sans le repasser au sanitizer —
          un compte admin compromis ne doit pas devenir une faille XSS
          pour tous les visiteurs du site. */}
      <article
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(module.contenu_html) }}
      />
    </main>
  );
}