"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getRandomQuestion, answerQuestion } from "@/lib/api";

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

export default function QuestoesPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [subject, setSubject] = useState<string>("");

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
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  const subjects = [
    { value: "", label: "🎲 Aleatório" },
    { value: "MATEMATICA", label: "📐 Matemática" },
    { value: "LINGUAGENS", label: "📚 Linguagens" },
    { value: "CIENCIAS_HUMANAS", label: "🌍 Ciências Humanas" },
    { value: "CIENCIAS_NATUREZA", label: "🔬 Ciências da Natureza" },
  ];

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-4xl animate-float">⚔️</div>
        <span className="mt-4 text-gray-400">Preparando questão...</span>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="text-gray-400 mb-4">Nenhuma questão encontrada.</span>
        <button onClick={fetchQuestion} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Voltar</Link>
          <span className="text-lg font-bold">📝 Questão</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Subject filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s.value}
              onClick={() => setSubject(s.value)}
              className={`px-3 py-1.5 text-xs rounded-lg transition ${
                subject === s.value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card)] border border-[var(--card-border)] text-gray-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              question.difficulty === "EASY" ? "bg-green-500/20 text-green-400" :
              question.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {question.difficulty === "EASY" ? "Fácil" : question.difficulty === "MEDIUM" ? "Médio" : "Difícil"}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/20 text-[var(--primary-light)]">
              {question.subject.replace("_", " ")}
            </span>
            <span className="text-xs text-gray-500">
              +{question.difficulty === "EASY" ? 10 : question.difficulty === "MEDIUM" ? 20 : 40} XP
            </span>
          </div>

          <p className="text-lg leading-relaxed">{question.statement}</p>
        </div>

        {/* Alternatives */}
        <div className="space-y-3 mb-6">
          {question.alternatives.map((alt, i) => {
            const isSelected = selected === alt.id;
            const isCorrect = result && result.answer?.isCorrect && isSelected;
            const isWrong = result && !result.answer?.isCorrect && isSelected;

            return (
              <button
                key={alt.id}
                onClick={() => !result && setSelected(alt.id)}
                disabled={!!result}
                className={`w-full p-4 rounded-xl border text-left transition ${
                  isCorrect
                    ? "border-green-500 bg-green-500/10"
                    : isWrong
                    ? "border-red-500 bg-red-500/10"
                    : isSelected
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="font-bold text-[var(--primary-light)] mr-2">
                  {String.fromCharCode(65 + i)})
                </span>
                {alt.text}
                {isCorrect && <span className="ml-2">✓</span>}
                {isWrong && <span className="ml-2">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Result */}
        {result && (
          <div className={`p-6 rounded-xl mb-6 ${result.answer?.isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{result.answer?.isCorrect ? "🎉" : "😔"}</span>
              <div>
                <h3 className={`font-bold text-lg ${result.answer?.isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {result.answer?.isCorrect ? "Correto!" : "Incorreto!"}
                </h3>
                {result.answer?.isCorrect && (
                  <p className="text-[var(--accent)] font-bold">+{result.answer.xpEarned} XP</p>
                )}
              </div>
            </div>

            {result.user && (
              <div className="flex gap-4 text-sm text-gray-400 mb-3">
                <span>📊 Nv. {result.user.level} • {result.user.xp}/{result.user.xpToNextLevel} XP</span>
                <span>🔥 {result.user.streak} dias</span>
              </div>
            )}

            {result.explanation && (
              <div className="mt-3 p-3 rounded-lg bg-[var(--background)] text-sm">
                <strong>💡 Explicação:</strong> {result.explanation}
              </div>
            )}

            {result.newAchievements?.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                <strong>🏆 Nova conquista!</strong>
                {result.newAchievements.map((a: any) => (
                  <div key={a.id} className="text-sm mt-1">{a.icon} {a.name} — {a.description}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {!result ? (
            <button
              onClick={handleAnswer}
              disabled={!selected || loading}
              className="flex-1 py-3 rounded-xl font-bold bg-[var(--primary)] hover:bg-[var(--primary-light)] transition disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {loading ? "Verificando..." : "✓ Responder"}
            </button>
          ) : (
            <button
              onClick={fetchQuestion}
              className="flex-1 py-3 rounded-xl font-bold bg-[var(--primary)] hover:bg-[var(--primary-light)] transition text-white"
            >
              ⚔️ Próxima Questão
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
