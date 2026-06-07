"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDashboard, logout } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-[var(--foreground-muted)] text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  const { user, stats, weeklyLog } = data;
  const maxXp = Math.max(...(weeklyLog || []).map((d: any) => d.xp), 1);

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      {/* Header with XP bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="text-lg font-bold text-[var(--foreground)]">Questfy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/questoes" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Questões</Link>
            <Link href="/missoes" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Missões</Link>
            <Link href="/ranking" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Ranking</Link>
            <Link href="/simulado" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Simulados</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/perfil" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="badge badge-primary">Nv. {user?.level || 1}</span>
              <span className={`badge badge-${getRankColor(user?.rank)}`}>Rank {user?.rank || "E"}</span>
            </Link>
            <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
            <button onClick={() => { logout(); router.push("/"); }} className="btn btn-secondary btn-sm">Sair</button>
          </div>
        </div>

        {/* Global XP Bar */}
        <div className="h-1 bg-[var(--background-secondary)]">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100, 100)}%` }}
          />
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Olá, {user?.username}</h1>
            <p className="text-[var(--foreground-secondary)]">Acompanhe seu progresso e continue estudando.</p>
          </div>
          <Link href="/perfil" className="btn btn-secondary btn-sm">Ver perfil completo</Link>
        </div>

        {/* Streak Banner */}
        {(user?.streak || 0) > 0 && (
          <div className="card p-4 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-800">Sequência de {user.streak} {user.streak === 1 ? "dia" : "dias"}</p>
                <p className="text-sm text-orange-600">
                  {user.streak >= 7 ? "Incrível! Você está pegando fogo!" : user.streak >= 3 ? "Continue assim! Falta pouco para uma semana." : "Estude amanhã para manter sua sequência!"}
                </p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < (user.streak % 7 || (user.streak >= 7 ? 7 : user.streak))
                        ? "bg-orange-400"
                        : "bg-orange-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="XP Atual" value={user?.xp || 0} subtitle={`de ${user?.xpToNextLevel || 100} para Nv. ${(user?.level || 1) + 1}`} accent="primary" />
          <StatCard label="Nível" value={user?.level || 1} subtitle={`Total: ${(user?.totalXp || 0).toLocaleString()} XP`} accent="success" />
          <StatCard label="Rank" value={user?.rank || "E"} subtitle={getRankLabel(user?.rank)} accent="warning" />
          <StatCard label="Streak" value={`${user?.streak || 0} dias`} subtitle="Sequência de estudos" accent="danger" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Weekly Chart */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Atividade Semanal</h3>
            <div className="flex items-end gap-2 h-32">
              {(weeklyLog || []).map((day: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-24">
                    <div
                      className="w-full rounded-t bg-[var(--primary)] transition-all duration-300 min-h-[4px]"
                      style={{ height: `${Math.max((day.xp / maxXp) * 100, 4)}%` }}
                      title={`${day.xp} XP`}
                    />
                  </div>
                  <span className="text-xs text-[var(--foreground-muted)]">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--foreground-muted)]">Esta semana</span>
              <span className="text-sm font-medium">
                {(weeklyLog || []).reduce((sum: number, d: any) => sum + d.xp, 0)} XP total
              </span>
            </div>
          </div>

          {/* Subject Stats */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Desempenho por Matéria</h3>
            {stats?.subjectStats?.length > 0 ? (
              <div className="space-y-3">
                {stats.subjectStats.map((s: any) => {
                  const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                  return (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{formatSubject(s.subject)}</span>
                        <span className="text-xs text-[var(--foreground-muted)]">{s.correct}/{s.total} ({pct}%)</span>
                      </div>
                      <div className="progress-bar" style={{ height: "6px" }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--foreground-muted)] text-center py-8">
                Responda questões para ver seu desempenho por matéria.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ActionCard href="/questoes" title="Resolver Questões" description="Ganhe XP respondendo questões do ENEM" accent="primary" />
          <ActionCard href="/missoes" title="Missões Diárias" description="Complete missões para bônus de XP" accent="success" />
          <ActionCard href="/simulado" title="Simulados" description="Enfrente simulados completos" accent="warning" />
        </div>

        {/* Recent Achievements */}
        {data?.recentAchievements?.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Conquistas Recentes</h3>
              <Link href="/perfil" className="text-sm text-[var(--primary)] hover:underline">Ver todas</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.recentAchievements.map((ra: any) => (
                <div key={ra.id} className="flex-shrink-0 w-32 p-3 rounded-lg bg-[var(--success-light)] border border-green-200 text-center">
                  <span className="text-2xl">{ra.achievement?.icon}</span>
                  <p className="text-xs font-medium mt-1">{ra.achievement?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, subtitle, accent }: { label: string; value: any; subtitle: string; accent: string }) {
  const colors: Record<string, string> = {
    primary: "text-[var(--primary)]",
    success: "text-[var(--success)]",
    warning: "text-[var(--accent)]",
    danger: "text-[var(--danger)]",
  };
  return (
    <div className="card p-5">
      <p className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[accent] || "text-[var(--foreground)]"}`}>{value}</p>
      <p className="text-xs text-[var(--foreground-muted)] mt-1">{subtitle}</p>
    </div>
  );
}

function ActionCard({ href, title, description, accent }: { href: string; title: string; description: string; accent: string }) {
  const colors: Record<string, string> = {
    primary: "bg-[var(--primary-light)] text-[var(--primary)]",
    success: "bg-[var(--success-light)] text-[var(--success)]",
    warning: "bg-[var(--warning-light)] text-[var(--accent)]",
  };
  return (
    <Link href={href} className="card p-5 hover:border-[var(--border-dark)] transition group">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[accent]}`}>
        <span className="text-lg">{accent === "primary" ? "📝" : accent === "success" ? "🎯" : "👑"}</span>
      </div>
      <h4 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition">{title}</h4>
      <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
    </Link>
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
    MATEMATICA: "Matemática", LINGUAGENS: "Linguagens",
    CIENCIAS_HUMANAS: "Ciências Humanas", CIENCIAS_NATUREZA: "Ciências da Natureza", REDACAO: "Redação",
  };
  return map[subject] || subject;
}
