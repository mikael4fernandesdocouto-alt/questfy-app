import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Questfy — Plataforma de Estudos para o ENEM",
  description: "Prepare-se para o ENEM e vestibulares com uma plataforma gamificada. Questões, simulados, ranking e acompanhamento de desempenho.",
  keywords: ["ENEM", "vestibular", "estudos", "questões", "simulados", "preparação"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
