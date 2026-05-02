# Encore OS

**Your next act starts here.** A relocation guide that helps people explore where to move given their life situation, practical constraints, and appetite for opportunity.

## How It Works

1. **Take the Assessment** - 5-step form covering your finances, household, priorities, openness to change, and career outlook
2. **Generate Scenarios** - GPT-4o produces 4 personalized relocation scenarios
3. **Get Results** - Each recommendation includes cost comparison, career resilience, honest tradeoffs, and practical next steps
4. **Share** - Shareable URLs for each result set

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** - Navy/gold/cream design language
- **Supabase** - Auth, assessment storage, email capture
- **OpenAI GPT-4o** - Recommendation engine
- **Vercel** - Deployment target

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENAI_API_KEY

# Run the Supabase migration
# Copy contents of supabase/migration.sql into your Supabase SQL editor

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── assess/page.tsx       # Multi-step assessment form
│   ├── results/page.tsx      # Results display
│   ├── saved/[token]/page.tsx # Shareable results URL
│   └── api/
│       ├── assess/route.ts   # GPT-4o recommendation engine
│       ├── results/route.ts  # Fetch saved results
│       └── email-capture/route.ts
├── components/
│   └── ResultsView.tsx       # Results cards UI
└── lib/
    ├── types.ts              # TypeScript types
    └── supabase.ts           # Supabase client
supabase/
└── migration.sql             # Database schema
```

## Design

- Color palette: Deep navy (#0F1F3D), warm gold (#C9A84C), soft white (#F8F6F1), slate gray (#6B7280)
- Typography: Playfair Display (headlines) + Inter (body)
- Dark mode primary with navy backgrounds
- PWA-ready with manifest.json

## Deployment

```bash
# Deploy to Vercel
vercel
```

Set environment variables in Vercel dashboard before deploying.
