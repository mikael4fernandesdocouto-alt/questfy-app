"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao fazer login");
      }

      const { token } = await res.json();
      localStorage.setItem("questfy_token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold gradient-text">
            ⚔️ Questfy
          </Link>
          <p className="text-gray-400 mt-2">Entre na sua jornada</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-xl bg-[var(--card)] border border-[var(--card-border)] space-y-5"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--primary)] outline-none transition text-white"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--primary)] outline-none transition text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-[var(--primary)] hover:bg-[var(--primary-light)] transition disabled:opacity-50 text-white"
          >
            {loading ? "Entrando..." : "⚔️ Entrar"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Não tem conta?{" "}
            <Link href="/register" className="text-[var(--primary-light)] hover:underline">
              Criar agora
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
