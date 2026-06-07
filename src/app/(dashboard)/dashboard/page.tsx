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
        <div className="text-2xl animate-float">⚔️</div>
        <span className="ml-3 text-gray-400">Carregando...</span>
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <span className="text-lg font-bold gradient-text">Questfy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/questoes" className="text-sm text-gray-400 hover:text-white">Questões</Link>
            <Link href="/missoes" className="text-sm text-gray-400 hover:text-white">Missões</Link>
            <Link href="/ranking" className="text-sm text-gray-400 hover:text-white">Ranking</Link>
            <Link href="/simulado" className="text-sm text-gray-400 hover:text-white">Boss Battle</Link>
            <div className="flex items-center gap-2 pl-4 border-l border-[var(--card-border)]">
              <span className="text-sm">{getRankEmoji(user?.rank)}</span>
              <span className="text-sm font-medium">{user?.username}</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/20 text-[var(--primary-light)]">
                Nv. {user?.level}
              </span>
              <button onClick={() => { logout(); router.push("/"); }} className="text-xs text-gray-500 hover:text-red-400 ml-2">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Olá, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Pronto para mais uma jornada de estudos?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card icon="⭐" label="XP Atual" value={user?.xp || 0} accent="text-[var(--accent)]" />
          <Card icon="📊" label="Nível" value={user?.level || 1} accent="text-[var(--primary-light)]" />
          <Card icon={getRankEmoji(user?.rank)} label="Rank" value={user?.rank || "E"} accent="text-[var(--secondary)]" />
          <Card icon="🔥" label="Streak" value={`${user?.streak || 0} dias`} accent="text-orange-400" />
        </div>

        {/* XP Progress */}
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progresso de Nível</span>
            <span className="text-sm font-medium">{user?.xp || 0} / {user?.xpToNextLevel || 100} XP</span>
          </div>
          <div className="h-3 rounded-full bg-[var(--background)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
              style={{ width: `${Math.min(((user?.xp || 0) / (user?.xpToNextLevel || 100)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <QuickAction icon="📝" title="Resolver Questões" description="Ganhe XP respondendo questões" href="/questoes" />
          <QuickAction icon="🎯" title="Missões Diárias" description="Complete missões para bônus" href="/missoes" />
          <QuickAction icon="👑" title="Boss Battle" description="Enfrente um simulado completo" href="/simulado" />
        </div>

        {/* Stats */}
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
          <h2 className="text-lg font-bold mb-4">📈 Seu Desempenho</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--background)]">
              <div className="text-2xl font-bold text-[var(--primary-light)]">{stats?.totalAnswers || 0}</div>
              <div className="text-xs text-gray-500">Questões Respondidas</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--background)]">
              <div className="text-2xl font-bold text-[var(--success)]">{stats?.correctAnswers || 0}</div>
              <div className="text-xs text-gray-500">Acertos</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--background)]">
              <div className="text-2xl font-bold text-[var(--accent)]">{stats?.accuracy || 0}%</div>
              <div className="text-xs text-gray-500">Precisão</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ icon, label, value, accent }: { icon: string; label: string; value: any; accent: string }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function QuickAction({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="p-5 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)] transition group">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}

function getRankEmoji(rank: string): string {
  const map: Record<string, string> = { E: "⚪", D: "🟤", C: "🟢", B: "🔵", A: "🟣", S: "🟡" };
  return map[rank] || "⚪";
}
