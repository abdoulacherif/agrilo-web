import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div>Connecté : {admin.email}</div>
        <nav>
          <a href="/admin">Dashboard</a>
          <a href="/admin/modules">Formations</a>
          <a href="/admin/utilisateurs">Utilisateurs</a>
          <a href="/admin/contenu">Contenu du site</a>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}