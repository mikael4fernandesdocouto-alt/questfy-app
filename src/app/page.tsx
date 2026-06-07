import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="text-xl font-bold gradient-text">Questfy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-light)] transition text-white"
          >
            Começar Grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-float mb-8 text-6xl">🎮</div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Seus estudos.
          <br />
          <span className="gradient-text">Modo RPG.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-8">
          Ganhe XP, suba de nível, complete missões e enfrente Boss Battles
          enquanto domina o ENEM e vestibulares.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="px-8 py-3 text-lg font-bold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-light)] transition text-white animate-glow"
          >
            ⚔️ Iniciar Jornada
          </Link>
          <Link
            href="/ranking"
            className="px-8 py-3 text-lg font-bold rounded-xl border border-[var(--card-border)] hover:border-[var(--primary)] transition"
          >
            🏆 Ver Ranking
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--primary-light)]">10k+</div>
            <div className="text-sm text-gray-500">Questões</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--secondary)]">5k+</div>
            <div className="text-sm text-gray-500">Guerreiros</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--accent)]">6</div>
            <div className="text-sm text-gray-500">Ranks</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="⚡"
            title="XP & Níveis"
            description="Ganhe XP a cada questão correta e suba de nível. Rank E até S."
          />
          <FeatureCard
            icon="🎯"
            title="Missões Diárias"
            description="Complete missões todos os dias para bônus de XP e mantenha seu streak."
          />
          <FeatureCard
            icon="👑"
            title="Boss Battles"
            description="Simulados completos que testam seus conhecimentos. +300 XP."
          />
          <FeatureCard
            icon="🏆"
            title="Ranking Global"
            description="Compete com outros estudantes e suba no ranking."
          />
          <FeatureCard
            icon="🔥"
            title="Streak"
            description="Estude todos os dias para multiplicar seus ganhos de XP."
          />
          <FeatureCard
            icon="🤖"
            title="IA Explicadora"
            description="Entenda cada resposta com explicações da IA (Pro)."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--card-border)] text-center text-gray-600 text-sm">
        © 2026 Questfy — Feito com ❤️ para estudantes brasileiros
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--primary)] transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
