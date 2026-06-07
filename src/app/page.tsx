import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-[var(--border)] bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">Questfy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn btn-secondary btn-sm"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="btn btn-primary btn-sm"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
              Plataforma de estudos gamificada
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              Prepare-se para o{" "}
              <span className="text-[var(--primary)]">ENEM</span>{" "}
              de forma inteligente
            </h1>
            <p className="text-lg md:text-xl text-[var(--foreground-secondary)] mb-10 max-w-2xl mx-auto">
              Resolva questões, acompanhe seu desempenho, suba de nível e concorra
              com outros estudantes. Transforme seus estudos em resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="btn btn-primary btn-lg"
              >
                Começar agora — É grátis
              </Link>
              <Link
                href="/ranking"
                className="btn btn-secondary btn-lg"
              >
                Ver ranking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value="30+" label="Questões do ENEM" />
            <Stat value="5" label="Matérias" />
            <Stat value="6" label="Níveis de Rank" />
            <Stat value="100%" label="Gratuito" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para o ENEM
            </h2>
            <p className="text-[var(--foreground-secondary)] text-lg max-w-2xl mx-auto">
              Uma plataforma completa com questões, simulados e acompanhamento de desempenho.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="📝"
              title="Questões do ENEM"
              description="Banco de questões organizadas por matéria e dificuldade, com explicações detalhadas."
            />
            <FeatureCard
              icon="📊"
              title="Acompanhamento"
              description="Dashboard completo com estatísticas de desempenho, acertos por matéria e evolução."
            />
            <FeatureCard
              icon="🏆"
              title="Ranking"
              description="Compita com outros estudantes e acompanhe sua posição no ranking global."
            />
            <FeatureCard
              icon="🎯"
              title="Missões Diárias"
              description="Complete missões para ganhar XP extra e manter sua rotina de estudos."
            />
            <FeatureCard
              icon="📈"
              title="Níveis e Ranks"
              description="Evolua do Rank E ao Rank S conforme estuda. Sistema de XP e níveis."
            />
            <FeatureCard
              icon="🔥"
              title="Streak"
              description="Mantenha sua sequência de estudos diários e multiplique seus ganhos."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[var(--background-secondary)] border-y border-[var(--border)]">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-[var(--foreground-secondary)] text-lg">
              Simples, direto e eficiente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Step number={1} title="Crie sua conta" description="Cadastro rápido e gratuito. Comece a estudar em segundos." />
            <Step number={2} title="Resolva questões" description="Escolha sua matéria e responda questões do ENEM com explicações." />
            <Step number={3} title="Evolua e compita" description="Ganhe XP, suba de rank e acompanhe seu progresso no ranking." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comece a estudar agora
            </h2>
            <p className="text-[var(--foreground-secondary)] text-lg mb-8">
              Junte-se a outros estudantes e prepare-se para o ENEM de forma inteligente.
            </p>
            <Link
              href="/register"
              className="btn btn-primary btn-lg"
            >
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">Q</span>
              </div>
              <span className="font-semibold text-[var(--foreground)]">Questfy</span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              © 2026 Questfy. Plataforma de estudos para o ENEM e vestibulares.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-1">{value}</div>
      <div className="text-sm text-[var(--foreground-muted)]">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--foreground-secondary)]">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--foreground-secondary)]">{description}</p>
    </div>
  );
}
