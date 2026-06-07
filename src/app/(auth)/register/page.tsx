"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao criar conta");
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
          <p className="text-gray-400 mt-2">Comece sua jornada épica</p>
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
            <label className="block text-sm font-medium mb-1.5 text-gray-300">Nome de Guerreiro</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--primary)] outline-none transition text-white"
              placeholder="SeuNome"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--primary)] outline-none transition text-white"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-[var(--primary)] hover:bg-[var(--primary-light)] transition disabled:opacity-50 text-white"
          >
            {loading ? "Criando..." : "⚔️ Criar Conta"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-[var(--primary-light)] hover:underline">
              Fazer login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
