"use client";

import { useRouter } from "next/navigation";

export default function QuestoesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
              ← Voltar
            </button>
            <span className="text-lg font-bold">📝 Questões</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Escolha sua Batalha</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SubjectCard icon="📐" title="Matemática" subject="MATEMATICA" color="text-blue-400" />
          <SubjectCard icon="📚" title="Linguagens" subject="LINGUAGENS" color="text-green-400" />
          <SubjectCard icon="🌍" title="Ciências Humanas" subject="CIENCIAS_HUMANAS" color="text-yellow-400" />
          <SubjectCard icon="🔬" title="Ciências da Natureza" subject="CIENCIAS_NATUREZA" color="text-purple-400" />
          <SubjectCard icon="✍️" title="Redação" subject="REDACAO" color="text-red-400" />
          <SubjectCard icon="🎲" title="Aleatório" subject="RANDOM" color="text-[var(--accent)]" />
        </div>
      </main>
    </div>
  );
}

function SubjectCard({
  icon,
  title,
  subject,
  color,
}: {
  icon: string;
  title: string;
  subject: string;
  color: string;
}) {
  return (
    <button className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)] transition text-left">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className={`font-bold ${color}`}>{title}</h3>
      <p className="text-xs text-gray-500 mt-1">Toque para começar</p>
    </button>
  );
}
