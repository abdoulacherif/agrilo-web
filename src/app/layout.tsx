import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agrilo — Formation agriculture et élevage",
  description:
    "Des formations pratiques pour agriculteurs, éleveurs, étudiants et débutants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}