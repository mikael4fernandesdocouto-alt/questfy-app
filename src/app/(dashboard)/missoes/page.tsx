"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyMissions, getActiveMissions, assignMission } from "@/lib/api";

export default function MissoesPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyMissions().catch(() => []), getActiveMissions().catch(() => [])])
      .then(([my, active]) => {
        setMissions(my || []);
        setActiveMissions(active || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAssign(missionId: string) {
    try {
      await assignMission(missionId);
      const my = await getMyMissions().catch(() => []);
      setMissions(my || []);
    } catch (e: any) {
      alert(e.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[var(--foreground-muted)]">Carregando missões...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-sm font-medium">
              ← Voltar
            </Link>
            <span className="font-semibold">Missões</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Minhas Missões */}
        <h2 className="text-xl font-bold mb-4">Minhas Missões</h2>
        {missions.length === 0 ? (
          <div className="card p-8 text-center mb-8">
            <p className="text-[var(--foreground-muted)]">Nenhuma missão atribuída ainda.</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Escolha uma missão abaixo para começar.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {missions.map((um: any) => (
              <div
                key={um.id}
                className={`card p-5 flex items-center gap-4 ${um.completed ? "opacity-60" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{um.mission?.title || um.title}</h3>
                    {um.completed && <span className="badge badge-success">Completa</span>}
                  </div>
                  <p className="text-sm text-[var(--foreground-secondary)]">{um.mission?.description || um.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="progress-bar flex-1" style={{ height: "6px" }}>
                      <div
                        className={`progress-bar-fill ${um.completed ? "bg-[var(--success)]" : ""}`}
                        style={{ width: `${Math.min(((um.progress || 0) / (um.mission?.targetCount || 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">
                      {um.progress || 0}/{um.mission?.targetCount || 0}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[var(--accent)] font-bold text-sm">+{um.mission?.xpReward || 0} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Missões Disponíveis */}
        <h2 className="text-xl font-bold mb-4">Missões Disponíveis</h2>
        <div className="space-y-3">
          {activeMissions.map((m: any) => {
            const alreadyAssigned = missions.some((um: any) => um.missionId === m.id);
            return (
              <div key={m.id} className="card p-5 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{m.title}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">{m.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent)] font-bold text-sm">+{m.xpReward} XP</span>
                  {alreadyAssigned ? (
                    <span className="badge badge-success">Atribuída</span>
                  ) : (
                    <button
                      onClick={() => handleAssign(m.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Aceitar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
