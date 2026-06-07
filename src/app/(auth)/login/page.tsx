"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("teste@questfy.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message.includes('API não disponível') || err.message.includes('fetch')) {
        setError("Backend não configurado. O deploy da API ainda não foi realizado.");
      } else {
        setError(err.message || "Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background-secondary)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">Questfy</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta</h1>
          <p className="text-[var(--foreground-secondary)]">Entre na sua conta para continuar estudando</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="p-3 rounded-lg bg-[var(--danger-light)] border border-red-200 text-[var(--danger)] text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="Sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="divider my-6" />

          <p className="text-center text-sm text-[var(--foreground-secondary)]">
            Não tem conta?{" "}
            <Link href="/register" className="text-[var(--primary)] font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
          Usuário de teste: teste@questfy.com / 123456
        </p>
      </div>
    </main>
  );
}
