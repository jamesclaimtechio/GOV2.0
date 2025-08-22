# Gov 2.0 - AI Compliance Platform

An AI-assisted compliance platform that compares your company's operating model against multiple regulatory frameworks and generates actionable remediation plans.

## 🚀 Features

- **Multi-Framework Analysis**: Compare against GDPR, ISO 27001, NIS2, and more
- **Intelligent Gap Detection**: AI-powered analysis with explainable rationale  
- **Conflict Resolution**: Identify cross-framework conflicts with mitigation strategies
- **Task Generation**: Convert compliance gaps into actionable tasks with owners
- **Scoping Wizard**: Guided questionnaire to determine applicable regulations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **API**: tRPC (type-safe) + TanStack Query
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI GPT-4 for analysis and recommendations
- **UI**: Tailwind CSS + shadcn/ui components
- **Auth**: NextAuth.js with email/password + 2FA

## 🏗️ Project Structure

```
app/                    # Next.js app router
├─ (public)/           # Public marketing pages
├─ (dashboard)/        # Authenticated dashboard
└─ api/trpc/          # tRPC API endpoints

components/            # Reusable UI components
server/               # Server-only business logic
├─ domain/           # Pure domain entities & use cases
├─ services/         # Orchestration layer
├─ ai/              # OpenAI integration & prompts
├─ rules/           # Compliance rules engine
└─ db/              # Database repositories

prisma/               # Database schema & migrations
lib/                  # Shared utilities
tests/                # Unit & integration tests
```

## 🔧 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Fill in your database URL and OpenAI API key
   ```

3. **Initialize database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Run tests**:
   ```bash
   npm test              # Unit tests
   npm run test:e2e      # End-to-end tests
   ```

## 🎯 MVP Scope

Phase 1 focuses on proving the core value proposition:
- ✅ Scoping questionnaire to determine applicable frameworks
- ✅ Multi-framework comparison engine
- ✅ Gap analysis with AI-generated explanations
- ✅ Conflict detection across frameworks
- ✅ Task generation and kanban board
- ✅ PDF/CSV export capabilities

## 🔐 Security & Privacy

- PII minimization and encryption at rest
- Comprehensive audit logging
- Role-based access control (Admin, Compliance Lead, Control Owner, Viewer)
- Document validation and virus scanning

## 📊 Data Model

The platform uses a comprehensive data model covering:
- Organizations and user management
- Assessment lifecycle and scoping
- Framework requirements and findings
- Conflict detection and task management
- Complete audit trail

## 🚢 Deployment

Optimized for Vercel deployment with:
- Edge runtime support where applicable
- Background jobs via Vercel Cron
- PostgreSQL database (Vercel Postgres or external)

## 📈 Roadmap

- **Phase 1**: MVP with core frameworks (GDPR, ISO 27001, NIS2)
- **Phase 2**: Enterprise features, integrations, multi-tenant architecture
- **Phase 3**: Real-time regulatory updates and advanced analytics

---

Built with ❤️ for modern compliance teams.
