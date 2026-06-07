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

  const { user, stats } = data;

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="text-lg font-bold text-[var(--foreground)]">Questfy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/questoes" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition">
              Questões
            </Link>
            <Link href="/missoes" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition">
              Missões
            </Link>
            <Link href="/ranking" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition">
              Ranking
            </Link>
            <Link href="/simulado" className="text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition">
              Simulados
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">Nv. {user?.level || 1}</span>
              <span className="badge badge-success">Rank {user?.rank || "E"}</span>
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="btn btn-secondary btn-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Olá, {user?.username}
          </h1>
          <p className="text-[var(--foreground-secondary)]">
            Acompanhe seu progresso e continue estudando.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="XP Atual"
            value={user?.xp || 0}
            subtitle={`de ${user?.xpToNextLevel || 100} para próximo nível`}
            accent="primary"
          />
          <StatCard
            label="Nível"
            value={user?.level || 1}
            subtitle={`Total: ${(user?.totalXp || 0).toLocaleString()} XP`}
            accent="success"
          />
          <StatCard
            label="Rank"
            value={user?.rank || "E"}
            subtitle={getRankLabel(user?.rank)}
            accent="warning"
          />
          <StatCard
            label="Streak"
            value={`${user?.streak || 0} dias`}
            subtitle="Sequência de estudos"
            accent="danger"
          />
        </div>

        {/* XP Progress */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Progresso de Nível</h3>
            <span className="text-sm text-[var(--foreground-muted)]">
              {user?.xp || 0} / {user?.xpToNextLevel || 100} XP
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <ActionCard
            href="/questoes"
            title="Resolver Questões"
            description="Ganhe XP respondendo questões do ENEM"
            accent="primary"
          />
          <ActionCard
            href="/missoes"
            title="Missões Diárias"
            description="Complete missões para bônus de XP"
            accent="success"
          />
          <ActionCard
            href="/simulado"
            title="Simulados"
            description="Enfrente simulados completos"
            accent="warning"
          />
        </div>

        {/* Performance */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Desempenho</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className="text-2xl font-bold text-[var(--primary)]">{stats?.totalAnswers || 0}</div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">Questões Respondidas</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className="text-2xl font-bold text-[var(--success)]">{stats?.correctAnswers || 0}</div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">Acertos</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className="text-2xl font-bold text-[var(--accent)]">{stats?.accuracy || 0}%</div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">Precisão</div>
            </div>
          </div>
        </div>
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

function getRankLabel(rank: string): string {
  const labels: Record<string, string> = {
    E: "Iniciante",
    D: "Aprendiz",
    C: "Estudante",
    B: "Dedicado",
    A: "Avançado",
    S: "Mestre",
  };
  return labels[rank] || "Iniciante";
}
