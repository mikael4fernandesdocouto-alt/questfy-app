"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyMissions, getActiveMissions, assignMission, updateMissionProgress } from "@/lib/api";

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
        <span className="text-gray-400">Carregando missões...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Voltar</Link>
            <span className="text-lg font-bold">🎯 Missões</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Minhas Missões */}
        <h2 className="text-xl font-bold mb-4">Minhas Missões</h2>
        {missions.length === 0 ? (
          <p className="text-gray-500 mb-8">Nenhuma missão atribuída ainda. Escolha uma abaixo!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {missions.map((um: any) => (
              <MissionCard
                key={um.id}
                title={um.mission?.title || um.title}
                description={um.mission?.description || um.description}
                xp={um.mission?.xpReward || um.xpReward}
                progress={um.progress}
                target={um.mission?.targetCount || um.targetCount}
                completed={um.completed}
                icon={getMissionIcon(um.mission?.type || um.type)}
              />
            ))}
          </div>
        )}

        {/* Missões Disponíveis */}
        <h2 className="text-xl font-bold mb-4">Missões Disponíveis</h2>
        <div className="space-y-4">
          {activeMissions.map((m: any) => {
            const alreadyAssigned = missions.some((um: any) => um.missionId === m.id);
            return (
              <div
                key={m.id}
                className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center gap-4"
              >
                <div className="text-3xl">{getMissionIcon(m.type)}</div>
                <div className="flex-1">
                  <h3 className="font-bold">{m.title}</h3>
                  <p className="text-sm text-gray-400">{m.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent)] font-bold">+{m.xpReward} XP</span>
                  {alreadyAssigned ? (
                    <span className="text-xs text-green-400">✓ Atribuída</span>
                  ) : (
                    <button
                      onClick={() => handleAssign(m.id)}
                      className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-light)] transition text-white"
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

function MissionCard({
  title, description, xp, progress, target, completed, icon,
}: {
  title: string; description: string; xp: number; progress: number; target: number; completed: boolean; icon: string;
}) {
  return (
    <div className={`p-5 rounded-xl bg-[var(--card)] border flex items-center gap-4 ${completed ? "border-green-500/50 opacity-75" : "border-[var(--card-border)]"}`}>
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{title}</h3>
          {completed && <span className="text-xs text-green-400">✓ Completa</span>}
        </div>
        <p className="text-sm text-gray-400">{description}</p>
        <div className="mt-2 h-2 rounded-full bg-[var(--background)] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${completed ? "bg-green-500" : "bg-[var(--primary)]"}`}
            style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{progress}/{target}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-[var(--accent)]">+{xp} XP</div>
        {!completed && progress >= target && (
          <button
            onClick={() => {}}
            className="mt-1 px-3 py-1 text-xs rounded-lg bg-green-600 hover:bg-green-500 transition text-white"
          >
            Coletar!
          </button>
        )}
      </div>
    </div>
  );
}

function getMissionIcon(type: string): string {
  const map: Record<string, string> = { DAILY: "📅", WEEKLY: "📆", SUBJECT: "📚", STREAK: "🔥" };
  return map[type] || "🎯";
}
