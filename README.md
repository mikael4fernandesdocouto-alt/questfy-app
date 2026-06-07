# Questfy — Micro SaaS de Estudos Gamificados

## 🎮 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, React 18, TailwindCSS 3 |
| Backend | NestJS 10, Prisma ORM, PostgreSQL |
| Auth | JWT (Passport) |
| Docs | Swagger/OpenAPI |
| Infra | Docker Compose |

## 🚀 Executar Localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/mikael4fernandesdocouto-alt/questfy-app.git
cd questfy-app

# Frontend
npm install

# Backend
cd api && npm install
```

### 2. Banco de dados (Docker)

```bash
docker compose up -d
```

### 3. Configurar API

```bash
cd api
cp .env.example .env
# Edite .env com suas credenciais do banco
```

### 4. Migrar e popular banco

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

### 5. Rodar

```bash
# Terminal 1 — Backend
cd api && npm run dev

# Terminal 2 — Frontend
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001/api/v1
- Swagger: http://localhost:3001/api/docs

## 📊 Sistema de Progressão

| Ação | XP |
|------|-----|
| Questão fácil | +10 |
| Questão média | +20 |
| Questão difícil | +40 |
| Missão diária | +100 |
| Simulado completo | +300 |

## 🏆 Ranks

| Rank | XP Mínimo |
|------|-----------|
| E | 0 |
| D | 500 |
| C | 1,500 |
| B | 4,000 |
| A | 8,000 |
| S | 15,000 |

## 📡 API Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Criar conta |
| POST | `/api/v1/auth/login` | Login |

### Users
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/users/me` | Perfil |
| GET | `/api/v1/users/me/stats` | Estatísticas |
| GET | `/api/v1/users/me/achievements` | Conquistas |

### Questions
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/questions` | Listar questões |
| GET | `/api/v1/questions/random` | Questão aleatória |
| GET | `/api/v1/questions/stats` | Stats por matéria |
| GET | `/api/v1/questions/:id` | Detalhes |

### Game
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/game/answer` | Responder questão |
| GET | `/api/v1/game/dashboard` | Dashboard |

### Missions
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/missions` | Missões ativas |
| GET | `/api/v1/missions/my` | Minhas missões |
| POST | `/api/v1/missions/assign` | Atribuir missão |
| POST | `/api/v1/missions/progress` | Atualizar progresso |

### Ranking
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/ranking` | Ranking global |
| GET | `/api/v1/ranking/me` | Minha posição |

## 📁 Estrutura de Pasturas

```
questfy-app/
├── src/                    # Frontend Next.js
│   ├── app/
│   │   ├── (auth)/         # Login, Register
│   │   ├── (dashboard)/    # Dashboard, Questões, Missões, Ranking, Simulado
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Landing page
│   │   └── globals.css
│   └── lib/                # API client, utils
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── auth/           # JWT auth
│   │   ├── users/          # CRUD usuários
│   │   ├── questions/      # CRUD questões
│   │   ├── missions/       # Missões
│   │   ├── game/           # XP, níveis, ranks, streak
│   │   ├── ranking/        # Ranking global
│   │   └── common/         # Prisma, config
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco
│   │   └── seed.ts         # Dados iniciais (ENEM)
│   └── package.json
├── docker-compose.yml
└── package.json
```

## 📅 Plano MVP — 30 dias

| Semana | Entregáveis |
|--------|------------|
| 1 | ✅ Setup, Auth, DB schema, CI/CD, Frontend base |
| 2 | ✅ CRUD questões, game system (XP/níveis/missões) |
| 3 | 🔄 Frontend integrado, simulados, ranking em tempo real |
| 4 | 🔄 Testes, deploy produção, IA explicadora |

---

Feito com ❤️ por zeca
