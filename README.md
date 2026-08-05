# Task Calendar

Sistema completo de gerenciamento de calendário e tarefas, moderno, rápido e open-source.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## Funcionalidades

### Calendário
- Visualização mensal, semanal, diária e agenda
- Criar tarefas clicando em um dia
- Editar tarefas clicando nelas
- Arrastar e redimensionar tarefas

### Tarefas
- Título, descrição, data, horário
- Prioridade (Urgente, Alta, Média, Baixa)
- Status (Não iniciada, Em andamento, Pausada, Concluída, Cancelada)
- Categorias ilimitadas com cores e ícones
- Tags/etiquetas
- Subtarefas e checklists
- Lembretes e repetição
- Anexos
- Histórico de alterações
- Favoritos e lixeira

### Dashboard
- Estatísticas gerais
- Gráficos semanais e mensais
- Tarefas atrasadas e do dia
- Sequência de dias produtivos
- Tempo gasto por categoria

### Extras
- Timer Pomodoro
- Metas semanais e mensais
- Importação e exportação JSON
- Atalhos de teclado
- PWA com funcionamento offline
- Notificações do navegador
- Pesquisa instantânea

## Stack Tecnológica

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Lucide Icons
- **Forms**: React Hook Form, Zod
- **State**: Zustand, TanStack Query
- **Database**: Prisma ORM, SQLite (dev) / PostgreSQL (produção)
- **Testes**: Vitest, Playwright

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/task-calendar.git
cd task-calendar

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev

# Popule com dados de exemplo
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:3000

## Deploy na Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Banco de dados PostgreSQL (recomendo [Neon](https://neon.tech) ou [Supabase](https://supabase.com))

### Passo a passo

1. **Faça push do código para o GitHub**

2. **Crie um banco de dados PostgreSQL**
   - No Neon/Supabase, crie um novo projeto
   - Copie a string de conexão (DATABASE_URL)

3. **Importe no Vercel**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe o repositório do GitHub
   - O framework Next.js será detectado automaticamente

4. **Configure as variáveis de ambiente**
   
   No painel do Vercel, vá em Settings > Environment Variables e adicione:
   
   | Variável | Valor |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://user:password@host:5432/dbname` |
   | `NEXTAUTH_URL` | `https://seu-app.vercel.app` |
   | `NEXTAUTH_SECRET` | `uma-chave-secreta-forte` |

5. **Faça deploy**
   - Clique em "Deploy"
   - O Vercel vai automaticamente:
     - Instalar dependências
     - Gerar o Prisma Client
     - Rodar as migrações do banco
     - Fazer o build do Next.js

6. **Rode as migrações do banco**
   
   Após o primeiro deploy, rode as migrações:
   ```bash
   npx prisma migrate deploy
   ```

7. **(Opcional) Popule com dados de exemplo**
   ```bash
   npm run db:seed
   ```

### Variáveis de Ambiente

```env
# Desenvolvimento (SQLite)
DATABASE_URL="file:./dev.db"

# Produção (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"
```

## Comandos Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Verificar código
npm run format       # Formatar código
npm run test         # Rodar testes unitários
npm run test:e2e     # Rodar testes E2E
npm run db:push      # Sincronizar banco
npm run db:seed      # Popular banco
npm run db:studio    # Abrir Prisma Studio
```

## Estrutura do Projeto

```
src/
├── app/              # Rotas e páginas
├── components/       # Componentes React
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Sidebar, Header
│   ├── calendar/    # Visualizações do calendário
│   ├── dashboard/   # Componentes do dashboard
│   ├── tasks/       # Formulário e lista de tarefas
│   └── shared/      # Componentes compartilhados
├── hooks/           # Zustand stores e hooks
├── lib/             # Utilitários e configurações
├── types/           # Definições TypeScript
├── repositories/    # Acesso ao banco de dados
├── services/        # Lógica de negócio
└── actions/         # Server Actions
prisma/
├── schema.prisma           # Schema do banco (SQLite)
├── schema.postgresql.prisma # Schema do banco (PostgreSQL)
├── schema.sqlite.prisma    # Schema do banco (SQLite backup)
├── migrations/              # Migrações
└── seed.ts                  # Dados de exemplo
```

## Licença

MIT License - veja [LICENSE](LICENSE) para mais detalhes.
