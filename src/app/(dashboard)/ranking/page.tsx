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
        <span className="text-[var(--foreground-muted)]">Carregando ranking...</span>
      </div>
    );
  }

  const entries = ranking?.entries || [];

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-sm font-medium">
              ← Voltar
            </Link>
            <span className="font-semibold">Ranking Global</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Ranking Global</h1>
          <p className="text-[var(--foreground-secondary)]">Temporada 2026</p>
        </div>

        {entries.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[var(--foreground-muted)] mb-2">Nenhum jogador no ranking ainda.</p>
            <p className="text-sm text-[var(--foreground-muted)]">Comece a estudar e seja o primeiro!</p>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            {entries.length >= 1 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {entries.slice(0, Math.min(3, entries.length)).map((entry: any, i: number) => {
                  const positions = [1, 0, 2];
                  const pos = positions[i];
                  return (
                    <div
                      key={entry.id || i}
                      className={`text-center p-5 rounded-xl bg-white border ${
                        pos === 0 ? "order-2 -mt-4 border-[var(--accent)] shadow-md" : pos === 1 ? "order-1 border-[var(--border)]" : "order-3 border-[var(--border)]"
                      }`}
                      style={{ minWidth: "140px" }}
                    >
                      <div className="text-3xl font-bold mb-1">{pos === 0 ? "🥇" : pos === 1 ? "🥈" : "🥉"}</div>
                      <div className="text-xl font-bold">#{entry.position || pos + 1}</div>
                      <div className="font-semibold text-sm mt-1">{entry.user?.username || "Anônimo"}</div>
                      <div className="text-xs text-[var(--foreground-muted)] mt-1">
                        Nv.{entry.user?.level || 1} • Rank {entry.user?.rank || "E"}
                      </div>
                      <div className="text-[var(--primary)] font-bold text-sm mt-2">
                        {(entry.xpTotal || 0).toLocaleString()} XP
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="card divide-y divide-[var(--border)]">
              {entries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center gap-4 hover:bg-[var(--background-secondary)] transition"
                >
                  <div className="w-8 text-center text-sm font-bold text-[var(--foreground-muted)]">
                    #{entry.position}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold">{entry.user?.username || "Anônimo"}</span>
                    <span className="text-xs text-[var(--foreground-muted)] ml-2">
                      Nv.{entry.user?.level || 1} • Rank {entry.user?.rank || "E"}
                    </span>
                  </div>
                  <div className="text-[var(--primary)] font-bold text-sm">
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
