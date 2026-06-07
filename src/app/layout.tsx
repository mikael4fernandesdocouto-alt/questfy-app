import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questfy — Estudos Gamificados",
  description: "Transforme seus estudos em uma jornada RPG. Ganhe XP, suba de nível e domine o ENEM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
