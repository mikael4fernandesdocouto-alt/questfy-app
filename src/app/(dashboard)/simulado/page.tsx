"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SimuladoPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exams from API
    fetch("/api/exams")
      .then(res => res.json())
      .then(data => setExams(data || []))
      .catch(() => setExams(getDefaultExams()))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">Carregando simulados...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Voltar</Link>
          <span className="text-lg font-bold">👑 Boss Battles</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">⚔️ Escolha seu Desafio</h1>
        <p className="text-gray-400 mb-6">Complete simulados para ganhar grandes quantidades de XP</p>

        <div className="grid md:grid-cols-2 gap-4">
          {(exams.length > 0 ? exams : getDefaultExams()).map((exam: any, i: number) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)] transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">{exam.icon || "👑"}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
                  +{exam.xpReward || 300} XP
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{exam.title}</h3>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>📝 {exam.questions || 45} questões</span>
                <span>⏱️ {exam.timeLimit || 90} min</span>
              </div>
              <div className="mt-3 text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  exam.difficulty === "Hard" ? "bg-red-500/20 text-red-400" :
                  exam.difficulty === "Médio" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  {exam.difficulty || "Médio"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function getDefaultExams() {
  return [
    { title: "ENEM 2024 - Completo", questions: 180, timeLimit: 330, xpReward: 300, icon: "👑", difficulty: "Hard" },
    { title: "ENEM - Matemática", questions: 45, timeLimit: 90, xpReward: 100, icon: "📐", difficulty: "Médio" },
    { title: "ENEM - Linguagens", questions: 45, timeLimit: 90, xpReward: 100, icon: "📚", difficulty: "Médio" },
    { title: "ENEM - Humanas", questions: 45, timeLimit: 90, xpReward: 100, icon: "🌍", difficulty: "Médio" },
    { title: "ENEM - Natureza", questions: 45, timeLimit: 90, xpReward: 100, icon: "🔬", difficulty: "Médio" },
    { title: "Simulado Relâmpago", questions: 10, timeLimit: 30, xpReward: 50, icon: "⚡", difficulty: "Fácil" },
  ];
}
