# Pipsoul Dashboard

Pipsoul Dashboard is a full-stack trading journal and performance analytics application built for retail forex traders.

It gives traders a centralized workspace to manage trading accounts, record trades, maintain a trading journal, analyze performance, track achievements, receive notifications, and interact with an AI trading assistant.

## Live Demo

https://pipsoul-dashboard-six.vercel.app/

## Features

- User authentication and account management
- Protected dashboard routes
- Trading account management
- Trade recording and management
- Realtime trade synchronization
- Trading performance analytics
- Equity performance chart
- Trading journal with image uploads
- User profile management
- Profile avatar upload
- In-app notifications
- Achievement and milestone system
- AI trading assistant
- Responsive dashboard interface
- Dark and light theme support
- Animated and interactive UI

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- Sonner

### Backend & Database

- Next.js API Routes
- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Realtime
- Supabase Storage

### Deployment

- Vercel

## Architecture

Pipsoul Dashboard is built around a Next.js application with Supabase providing authentication, database, storage, and realtime functionality.

The main application flow is:

```text
User
  │
  ▼
Next.js / React
  │
  ├── Authentication ──────► Supabase Auth
  │
  ├── Application Data ────► Supabase PostgreSQL
  │
  ├── File Uploads ────────► Supabase Storage
  │
  └── Realtime Updates ────► Supabase Realtime
  │
  ▼
Protected Dashboard
  ├── Dashboard
  ├── Trades
  ├── Analytics
  ├── Journal
  ├── Profile
  └── AI Assistant

```
The application uses React providers and custom hooks to share authentication, profile, account, notification, and trading state across the protected dashboard.

The AI assistant uses a server-side Next.js API route. The authenticated user's Supabase access token is verified before the request is sent to OpenAI.

## Project Structure

```text
pipsoul-dashboard/
├── public/
│   └── Logo.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── chat/
│   │   │           └── route.ts
│   │   ├── (protected)/
│   │   │   ├── ai/
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── journal/
│   │   │   ├── profile/
│   │   │   └── trades/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ai/
│   │   ├── charts/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── table/
│   │   ├── ui/
│   │   ├── AccountProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   ├── NotificationProvider.tsx
│   │   └── ProfileProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useProfile.ts
│   │   └── useTradesStore.ts
│   │
│   ├── lib/
│   │   ├── ai/
│   │   ├── achievements.ts
│   │   ├── calcStats.ts
│   │   ├── notifications.ts
│   │   └── supabase.ts
│   │
│   └── types/
│       ├── journal.ts
│       └── trade.ts
│
├── next.config.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```
