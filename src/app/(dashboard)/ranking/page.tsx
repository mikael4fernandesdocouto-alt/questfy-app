"use client";

import { useRouter } from "next/navigation";

export default function RankingPage() {
  const router = useRouter();

  const players = [
    { position: 1, username: "MestreDosConcursos", rank: "S", level: 42, xp: 15230, emoji: "🟡" },
    { position: 2, username: "EstudantePro", rank: "A", level: 35, xp: 9800, emoji: "🟣" },
    { position: 3, username: "VestibulandoX", rank: "A", level: 31, xp: 8500, emoji: "🟣" },
    { position: 4, username: "GuerraDoENEM", rank: "B", level: 28, xp: 6200, emoji: "🔵" },
    { position: 5, username: "FocoNosEstudos", rank: "B", level: 25, xp: 5100, emoji: "🔵" },
    { position: 6, username: "JogadorRPG", rank: "C", level: 20, xp: 3500, emoji: "🟢" },
    { position: 7, username: "AprendizDeMago", rank: "C", level: 18, xp: 2800, emoji: "🟢" },
    { position: 8, username: "NovatoBrabo", rank: "D", level: 12, xp: 1500, emoji: "🟤" },
    { position: 9, username: "CalouroDestemido", rank: "D", level: 8, xp: 800, emoji: "🟤" },
    { position: 10, username: "InicianteRPG", rank: "E", level: 3, xp: 200, emoji: "⚪" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
              ← Voltar
            </button>
            <span className="text-lg font-bold">🏆 Ranking Global</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Top 3 */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {players.slice(0, 3).map((p, i) => (
            <div
              key={p.position}
              className={`text-center p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] ${
                i === 0 ? "order-2 -mt-4 border-[var(--accent)]" : i === 1 ? "order-1" : "order-3"
              }`}
            >
              <div className="text-4xl mb-2">{p.emoji}</div>
              <div className="text-2xl font-bold">#{p.position}</div>
              <div className="font-bold text-sm mt-1">{p.username}</div>
              <div className="text-xs text-gray-400">Nv.{p.level} • Rank {p.rank}</div>
              <div className="text-[var(--accent)] font-bold text-sm mt-1">{p.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>

        {/* Rest */}
        <div className="space-y-2">
          {players.slice(3).map((p) => (
            <div
              key={p.position}
              className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center gap-4"
            >
              <div className="w-8 text-center text-lg font-bold text-gray-500">
                #{p.position}
              </div>
              <div className="text-2xl">{p.emoji}</div>
              <div className="flex-1">
                <span className="font-bold">{p.username}</span>
                <span className="text-xs text-gray-500 ml-2">Nv.{p.level} • Rank {p.rank}</span>
              </div>
              <div className="text-[var(--accent)] font-bold">{p.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
