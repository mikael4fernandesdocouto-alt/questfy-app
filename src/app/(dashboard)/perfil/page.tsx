"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/api";

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-[var(--foreground-muted)] text-sm">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  const { user, stats } = profile;
  const totalAchievements = profile.achievements?.all?.length || 0;
  const unlockedAchievements = profile.achievements?.unlocked?.length || 0;
  const totalTitles = profile.titles?.all?.length || 0;
  const unlockedTitles = profile.titles?.unlocked?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-sm font-medium">
            ← Voltar ao Dashboard
          </Link>
          <span className="font-semibold">Meu Perfil</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{user?.username}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                <span className="badge badge-primary">Nv. {user?.level}</span>
                <span className={`badge badge-${getRankColor(user?.rank)}`}>Rank {user?.rank}</span>
                <span className="badge badge-success">{user?.rank ? getRankLabel(user.rank) : "Iniciante"}</span>
              </div>

              {/* XP Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--foreground-muted)]">XP para próximo nível</span>
                  <span className="text-sm font-medium">{user?.xp} / {user?.xpToNextLevel} XP</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-[var(--foreground-muted)]">
                XP Total: <strong className="text-[var(--foreground)]">{(user?.totalXp || 0).toLocaleString()}</strong>
                {" · "}
                Streak: <strong className="text-[var(--foreground)]">{user?.streak || 0} dias</strong>
                {" · "}
                Membro desde {new Date(user?.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--primary)]">{stats?.totalAnswers || 0}</div>
            <div className="text-xs text-[var(--foreground-muted)] mt-1">Questões</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--success)]">{stats?.correctAnswers || 0}</div>
            <div className="text-xs text-[var(--foreground-muted)] mt-1">Acertos</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--accent)]">{stats?.accuracy || 0}%</div>
            <div className="text-xs text-[var(--foreground-muted)] mt-1">Precisão</div>
          </div>
          <div className="card p-5 text-center">
            <div className="text-2xl font-bold text-orange-500">{user?.streak || 0}</div>
            <div className="text-xs text-[var(--foreground-muted)] mt-1">Streak</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Conquistas</h2>
              <span className="text-sm text-[var(--foreground-muted)]">
                {unlockedAchievements}/{totalAchievements}
              </span>
            </div>
            <div className="progress-bar mb-4">
              <div
                className="progress-bar-fill bg-[var(--secondary)]"
                style={{ width: `${totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0}%` }}
              />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {profile.achievements?.all?.map((a: any) => {
                const unlocked = profile.achievements?.unlocked?.some((ua: any) => ua.id === a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      unlocked ? "bg-[var(--success-light)]" : "bg-[var(--background-secondary)] opacity-50"
                    }`}
                  >
                    <span className="text-xl">{unlocked ? a.icon : "🔒"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{a.name}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{a.description}</p>
                    </div>
                    {unlocked && <span className="badge badge-success text-xs">Desbloqueada</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Titles */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Títulos</h2>
              <span className="text-sm text-[var(--foreground-muted)]">
                {unlockedTitles}/{totalTitles}
              </span>
            </div>
            <div className="progress-bar mb-4">
              <div
                className="progress-bar-fill bg-[var(--accent)]"
                style={{ width: `${totalTitles > 0 ? (unlockedTitles / totalTitles) * 100 : 0}%` }}
              />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {profile.titles?.all?.map((t: any) => {
                const unlocked = profile.titles?.unlocked?.some((ut: any) => ut.id === t.id);
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      unlocked ? "bg-[var(--warning-light)]" : "bg-[var(--background-secondary)] opacity-50"
                    }`}
                  >
                    <span className="text-xl">{unlocked ? t.icon : "🔒"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{t.description}</p>
                    </div>
                    {unlocked && <span className="badge badge-warning text-xs">Desbloqueado</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject Stats */}
        {stats?.subjectStats?.length > 0 && (
          <div className="card p-6 mt-6">
            <h2 className="font-bold text-lg mb-4">Desempenho por Matéria</h2>
            <div className="space-y-4">
              {stats.subjectStats.map((s: any) => {
                const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={s.subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{formatSubject(s.subject)}</span>
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {s.correct}/{s.total} ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getRankColor(rank: string): string {
  const map: Record<string, string> = { E: "gray", D: "warning", C: "success", B: "primary", A: "primary", S: "warning" };
  return map[rank] || "gray";
}

function getRankLabel(rank: string): string {
  const map: Record<string, string> = { E: "Iniciante", D: "Aprendiz", C: "Estudante", B: "Dedicado", A: "Avançado", S: "Mestre" };
  return map[rank] || "Iniciante";
}

function formatSubject(subject: string): string {
  const map: Record<string, string> = {
    MATEMATICA: "Matemática",
    LINGUAGENS: "Linguagens",
    CIENCIAS_HUMANAS: "Ciências Humanas",
    CIENCIAS_NATUREZA: "Ciências da Natureza",
    REDACAO: "Redação",
  };
  return map[subject] || subject;
}
