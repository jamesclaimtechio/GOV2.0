# 🚀 Vercel Deployment Guide

## 1️⃣ Prerequisites

- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **PostgreSQL Database**: Vercel Postgres or external provider (Neon, Supabase, etc.)
- **OpenAI API Key**: From [platform.openai.com](https://platform.openai.com)

## 2️⃣ Database Setup

### Option A: Vercel Postgres (Recommended for simplicity)
1. In your Vercel dashboard, go to Storage → Create → Postgres
2. Copy the connection string from the `.env.local` tab
3. Note: Vercel Postgres automatically sets `POSTGRES_URL` environment variable

### Option B: External PostgreSQL
1. Create a PostgreSQL database (Neon, Supabase, etc.)
2. Get your connection string in format: `postgresql://user:pass@host:port/dbname`

## 3️⃣ Environment Variables

Set these in your Vercel project dashboard (Settings → Environment Variables):

```env
# Database
DATABASE_URL=postgresql://your-db-connection-string
POSTGRES_URL=postgresql://your-db-connection-string  # If using Vercel Postgres

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Authentication  
NEXTAUTH_SECRET=your-super-secure-random-string
NEXTAUTH_URL=https://your-app-name.vercel.app

# Application
APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
WEBHOOK_SECRET=webhook-validation-secret
CRON_SECRET=cron-job-authentication-secret
```

### 🔐 Generating Secure Secrets

```bash
# Generate NEXTAUTH_SECRET (32 chars)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (32 chars)  
openssl rand -hex 32

# Generate other secrets (16 chars)
openssl rand -base64 16
```

## 4️⃣ Deploy to Vercel

### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect repository in Vercel dashboard
3. Vercel auto-deploys on every push to `main`

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to configure project
```

## 5️⃣ Post-Deployment Setup

### Initialize Database
```bash
# Run migrations (one-time setup)
vercel env pull .env.production.local
npm run db:migrate:deploy
npm run db:seed
```

### Verify Deployment
- ✅ Visit your deployed URL
- ✅ Check `/api/trpc/assessment.list` endpoint
- ✅ Test scoping wizard flow
- ✅ Verify database connectivity

## 6️⃣ Production Optimizations

### Performance
- **Edge Runtime**: tRPC endpoints run on Vercel Edge for low latency
- **Static Generation**: Landing pages are pre-rendered for fast loading  
- **Image Optimization**: Next.js automatic image optimization enabled
- **Bundle Analysis**: Run `npm run build` to see bundle sizes

### Security
- **Security Headers**: CSP, HSTS, and other headers configured
- **API Rate Limiting**: Built into Vercel functions
- **HTTPS Only**: Automatic SSL certificates
- **Environment Isolation**: Secrets never exposed to client

### Monitoring
- **Function Logs**: Available in Vercel dashboard
- **Analytics**: Enable Vercel Analytics for usage insights
- **Error Tracking**: Consider adding Sentry integration

## 7️⃣ Vercel Configuration Files

### `vercel.json` Features:
- **Function Timeout**: 30s for compliance analysis
- **Cron Jobs**: Daily cleanup at 2 AM UTC  
- **CORS Headers**: API access configuration
- **Regional Deployment**: US East (iad1) for optimal performance

### Build Optimization:
- **Prisma Generation**: Automatic client generation
- **Type Checking**: Full TypeScript validation
- **Bundle Optimization**: Tree shaking and code splitting

## 8️⃣ Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Check dependencies
npm install
npm run type-check
npm run build
```

**Database Connection**:
```bash
# Test connection
npx prisma db pull
npx prisma studio
```

**Environment Variables**:
- Ensure all required vars are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Restart deployment after env var changes

### Debug Mode
Enable verbose logging by setting:
```env
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## 9️⃣ Monitoring & Maintenance

### Health Checks
- **API Health**: `GET /api/health` (create this endpoint)
- **Database**: Monitor connection pool usage
- **OpenAI**: Track API usage and rate limits

### Cron Jobs
- **Cleanup**: Runs daily to purge old audit logs
- **Health Check**: Optional monitoring endpoint
- **Data Backup**: Consider automated backups

---

## 🎯 Quick Deploy Checklist

- [ ] Create Vercel account and project
- [ ] Set up PostgreSQL database  
- [ ] Configure all environment variables
- [ ] Deploy via GitHub or CLI
- [ ] Run database migrations
- [ ] Test core functionality
- [ ] Enable monitoring and analytics

Your Gov 2.0 platform will be live and ready for compliance assessments! 🎉
