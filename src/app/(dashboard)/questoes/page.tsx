"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getRandomQuestion, answerQuestion } from "@/lib/api";
import LevelUpModal from "@/components/LevelUpModal";

interface Alternative {
  id: string;
  text: string;
}

interface Question {
  id: string;
  statement: string;
  difficulty: string;
  subject: string;
  explanation: string;
  alternatives: Alternative[];
}

const subjects = [
  { value: "", label: "Aleatório" },
  { value: "MATEMATICA", label: "Matemática" },
  { value: "LINGUAGENS", label: "Linguagens" },
  { value: "CIENCIAS_HUMANAS", label: "Ciências Humanas" },
  { value: "CIENCIAS_NATUREZA", label: "Ciências da Natureza" },
];

export default function QuestoesPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [subject, setSubject] = useState<string>("");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);

  const fetchQuestion = useCallback(async () => {
    setFetching(true);
    setSelected(null);
    setResult(null);
    try {
      const q = await getRandomQuestion(subject || undefined);
      setQuestion(q);
    } catch {
      setQuestion(null);
    } finally {
      setFetching(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  async function handleAnswer() {
    if (!question || !selected) return;
    setLoading(true);
    try {
      const res = await answerQuestion(question.id, selected);
      setResult(res);

      if (res.leveledUp) {
        setLevelUpData({ oldLevel: res.oldLevel, newLevel: res.newLevel, rank: res.user?.rank });
        setShowLevelUp(true);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-[var(--foreground-muted)] text-sm">Carregando questão...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      {showLevelUp && levelUpData && (
        <LevelUpModal
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          rank={levelUpData.rank}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
        <div className="container flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] text-sm font-medium">
            ← Voltar
          </Link>
          <span className="font-semibold">Questões</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {/* Subject filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s.value}
              onClick={() => setSubject(s.value)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                subject === s.value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white border border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border-dark)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {!question ? (
          <div className="card p-12 text-center">
            <p className="text-[var(--foreground-muted)] mb-4">Nenhuma questão encontrada.</p>
            <button onClick={fetchQuestion} className="btn btn-primary">Tentar novamente</button>
          </div>
        ) : (
          <>
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${
                  question.difficulty === "EASY" ? "badge-success" :
                  question.difficulty === "MEDIUM" ? "badge-warning" : "badge-danger"
                }`}>
                  {question.difficulty === "EASY" ? "Fácil" : question.difficulty === "MEDIUM" ? "Médio" : "Difícil"}
                </span>
                <span className="badge badge-primary">{question.subject.replace("_", " ")}</span>
                <span className="ml-auto text-xs text-[var(--foreground-muted)]">
                  +{question.difficulty === "EASY" ? 10 : question.difficulty === "MEDIUM" ? 20 : 40} XP
                </span>
              </div>
              <p className="text-base leading-relaxed">{question.statement}</p>
            </div>

            <div className="space-y-3 mb-6">
              {question.alternatives.map((alt, i) => {
                const isSelected = selected === alt.id;
                const showResult = !!result;
                const isCorrectAnswer = showResult && result.answer?.isCorrect && isSelected;
                const isWrongAnswer = showResult && !result.answer?.isCorrect && isSelected;

                return (
                  <button
                    key={alt.id}
                    onClick={() => !showResult && setSelected(alt.id)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border text-left transition ${
                      isCorrectAnswer ? "border-[var(--success)] bg-[var(--success-light)]" :
                      isWrongAnswer ? "border-[var(--danger)] bg-[var(--danger-light)]" :
                      isSelected ? "border-[var(--primary)] bg-[var(--primary-light)]" :
                      "border-[var(--border)] bg-white hover:border-[var(--border-dark)]"
                    }`}
                  >
                    <span className={`font-semibold mr-3 ${
                      isCorrectAnswer ? "text-[var(--success)]" :
                      isWrongAnswer ? "text-[var(--danger)]" :
                      isSelected ? "text-[var(--primary)]" : "text-[var(--foreground-muted)]"
                    }`}>
                      {String.fromCharCode(65 + i)})
                    </span>
                    {alt.text}
                    {isCorrectAnswer && <span className="ml-2 text-[var(--success)] font-bold">✓</span>}
                    {isWrongAnswer && <span className="ml-2 text-[var(--danger)] font-bold">✗</span>}
                  </button>
                );
              })}
            </div>

            {result && (
              <div className={`card p-6 mb-6 animate-fade-in ${result.answer?.isCorrect ? "border-[var(--success)]" : "border-[var(--danger)]"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.answer?.isCorrect ? "bg-[var(--success-light)]" : "bg-[var(--danger-light)]"
                  }`}>
                    <span className={`text-lg font-bold ${result.answer?.isCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                      {result.answer?.isCorrect ? "✓" : "✗"}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${result.answer?.isCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                      {result.answer?.isCorrect ? "Correto!" : "Incorreto"}
                    </h3>
                    {result.answer?.isCorrect && (
                      <p className="text-[var(--accent)] font-semibold text-sm">+{result.answer.xpEarned} XP</p>
                    )}
                  </div>
                </div>

                {result.user && (
                  <div className="flex gap-4 text-sm text-[var(--foreground-muted)] mb-4">
                    <span>Nível {result.user.level}</span>
                    <span>•</span>
                    <span>{result.user.xp}/{result.user.xpToNextLevel} XP</span>
                    <span>•</span>
                    <span>Rank {result.user.rank}</span>
                  </div>
                )}

                {result.explanation && (
                  <div className="p-4 rounded-lg bg-[var(--background-secondary)] text-sm">
                    <strong className="text-[var(--foreground)]">Explicação: </strong>
                    <span className="text-[var(--foreground-secondary)]">{result.explanation}</span>
                  </div>
                )}

                {result.newAchievements?.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-[var(--warning-light)] border border-amber-200">
                    <strong className="text-[var(--accent)]">Nova conquista!</strong>
                    {result.newAchievements.map((a: any) => (
                      <div key={a.id} className="text-sm mt-1 text-[var(--foreground-secondary)]">
                        {a.icon} {a.name} — {a.description}
                      </div>
                    ))}
                  </div>
                )}

                {result.newTitles?.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-[var(--primary-light)] border border-blue-200">
                    <strong className="text-[var(--primary)]">Novo título desbloqueado!</strong>
                    {result.newTitles.map((t: any) => (
                      <div key={t.id} className="text-sm mt-1 text-[var(--foreground-secondary)]">
                        {t.icon} {t.name} — {t.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              {!result ? (
                <button onClick={handleAnswer} disabled={!selected || loading} className="btn btn-primary btn-lg flex-1">
                  {loading ? "Verificando..." : "Responder"}
                </button>
              ) : (
                <button onClick={fetchQuestion} className="btn btn-primary btn-lg flex-1">
                  Próxima questão
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
