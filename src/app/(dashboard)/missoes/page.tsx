"use client";

import { useRouter } from "next/navigation";

export default function MissoesPage() {
  const router = useRouter();

  const missions = [
    { title: "Questões do Dia", description: "Responda 10 questões hoje", xp: 100, progress: 0, target: 10, icon: "📝" },
    { title: "Matemática", description: "Resolva 5 questões de Matemática", xp: 50, progress: 0, target: 5, icon: "📐" },
    { title: "Natureza", description: "Resolva 5 questões de Ciências da Natureza", xp: 50, progress: 0, target: 5, icon: "🔬" },
    { title: "Humanas", description: "Resolva 5 questões de Ciências Humanas", xp: 50, progress: 0, target: 5, icon: "🌍" },
    { title: "Fogo Ardente", description: "Mantenha um streak de 7 dias", xp: 100, progress: 0, target: 7, icon: "🔥" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
              ← Voltar
            </button>
            <span className="text-lg font-bold">🎯 Missões</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Missões Diárias</h1>

        <div className="space-y-4">
          {missions.map((mission, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center gap-4"
            >
              <div className="text-3xl">{mission.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold">{mission.title}</h3>
                <p className="text-sm text-gray-400">{mission.description}</p>
                <div className="mt-2 h-2 rounded-full bg-[var(--background)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--primary)]"
                    style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {mission.progress}/{mission.target}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[var(--accent)]">+{mission.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
