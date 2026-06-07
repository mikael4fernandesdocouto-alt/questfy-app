"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRanking } from "@/lib/api";

export default function RankingPage() {
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRanking("2026", 1, 50)
      .then(setRanking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Carregando ranking...</span>
      </div>
    );
  }

  const entries = ranking?.entries || [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Voltar</Link>
            <span className="text-lg font-bold">🏆 Ranking Global</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">🏆 Ranking Global — Temporada 2026</h1>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏜️</div>
            <p className="text-gray-400">Nenhum guerreiro no ranking ainda.</p>
            <p className="text-gray-500 text-sm mt-1">Comece a estudar e seja o primeiro!</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            {entries.length >= 1 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {entries.slice(0, Math.min(3, entries.length)).map((entry: any, i: number) => {
                  const positions = [1, 0, 2];
                  const pos = positions[i];
                  const e = entries[pos] || entry;
                  return (
                    <div
                      key={e.id || i}
                      className={`text-center p-4 rounded-xl bg-[var(--card)] border ${
                        pos === 0 ? "order-2 -mt-4 border-[var(--accent)]" : pos === 1 ? "order-1 border-[var(--card-border)]" : "order-3 border-[var(--card-border)]"
                      }`}
                    >
                      <div className="text-4xl mb-2">{getRankEmoji(e.user?.rank || "E")}</div>
                      <div className="text-2xl font-bold">#{e.position || pos + 1}</div>
                      <div className="font-bold text-sm mt-1">{e.user?.username || "Anônimo"}</div>
                      <div className="text-xs text-gray-400">Nv.{e.user?.level || 1} • Rank {e.user?.rank || "E"}</div>
                      <div className="text-[var(--accent)] font-bold text-sm mt-1">
                        {(e.xpTotal || 0).toLocaleString()} XP
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="space-y-2">
              {entries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center gap-4"
                >
                  <div className="w-8 text-center text-lg font-bold text-gray-500">
                    #{entry.position}
                  </div>
                  <div className="text-2xl">{getRankEmoji(entry.user?.rank || "E")}</div>
                  <div className="flex-1">
                    <span className="font-bold">{entry.user?.username || "Anônimo"}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Nv.{entry.user?.level || 1} • Rank {entry.user?.rank || "E"}
                    </span>
                  </div>
                  <div className="text-[var(--accent)] font-bold">
                    {(entry.xpTotal || 0).toLocaleString()} XP
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function getRankEmoji(rank: string): string {
  const map: Record<string, string> = { E: "⚪", D: "🟤", C: "🟢", B: "🔵", A: "🟣", S: "🟡" };
  return map[rank] || "⚪";
}
