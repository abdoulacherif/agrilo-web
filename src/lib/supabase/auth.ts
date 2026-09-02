import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./server";

export type Role = "admin" | "formateur" | "apprenant";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role ?? "apprenant") as Role,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  if (user.role !== "admin") redirect("/");
  return user;
}