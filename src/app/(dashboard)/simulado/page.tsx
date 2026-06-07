"use client";

import Link from "next/link";

export default function SimuladoPage() {
  const exams = [
    { title: "ENEM 2024 - Simulado Completo", questions: 180, timeLimit: 330, xpReward: 300, difficulty: "Difícil", description: "Simulado completo com todas as áreas do conhecimento." },
    { title: "ENEM - Matemática e suas Tecnologias", questions: 45, timeLimit: 90, xpReward: 100, difficulty: "Médio", description: "Questões de matemática do ENEM." },
    { title: "ENEM - Linguagens e Códigos", questions: 45, timeLimit: 90, xpReward: 100, difficulty: "Médio", description: "Questões de linguagens, códigos e suas tecnologias." },
    { title: "ENEM - Ciências Humanas", questions: 45, timeLimit: 90, xpReward: 100, difficulty: "Médio", description: "Questões de história, geografia, filosofia e sociologia." },
    { title: "ENEM - Ciências da Natureza", questions: 45, timeLimit: 90, xpReward: 100, difficulty: "Médio", description: "Questões de física, química e biologia." },
    { title: "Simulado Rápido", questions: 10, timeLimit: 30, xpReward: 50, difficulty: "Fácil", description: "Simulado rápido para testar seus conhecimentos." },
  ];

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-sm font-medium">
            ← Voltar
          </Link>
          <span className="font-semibold">Simulados</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Simulados</h1>
          <p className="text-[var(--foreground-secondary)]">
            Teste seus conhecimentos com simulados completos do ENEM.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {exams.map((exam, i) => (
            <div
              key={i}
              className="card p-6 hover:border-[var(--border-dark)] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${
                  exam.difficulty === "Difícil" ? "badge-danger" :
                  exam.difficulty === "Médio" ? "badge-warning" : "badge-success"
                }`}>
                  {exam.difficulty}
                </span>
                <span className="text-[var(--accent)] font-bold text-sm">+{exam.xpReward} XP</span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{exam.title}</h3>
              <p className="text-sm text-[var(--foreground-secondary)] mb-4">{exam.description}</p>
              <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                <span>{exam.questions} questões</span>
                <span>•</span>
                <span>{exam.timeLimit} min</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
