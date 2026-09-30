# Gbera Waitlist — Setup Guide

This is the Gbera pre-launch waitlist landing page. Built with **Next.js 16 (App Router)** + **Supabase**.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Database | Supabase (Postgres) |
| Styling | Vanilla CSS Modules |
| Fonts | Space Grotesk + Inter (via `next/font`) |
| Deploy | Vercel (recommended) |

---

## Getting Started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 2. Run the schema

In your Supabase dashboard → **SQL Editor**, paste and run the entire contents of [`supabase-schema.sql`](./supabase-schema.sql).

This creates:
- `waitlist` table with sequential position trigger
- `page_views` counter table
- `waitlist_stats` view (public, no PII)
- RLS policies (anon can't read individual rows)
- `increment_page_views()` RPC function

### 3. Configure environment variables

Copy `.env.local` and fill in your actual values from Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Find these in: Supabase Dashboard → Settings → API.

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is only used in server-side API routes.

### 4. (Optional) Google Sheets sync

To sync submissions to a Google Sheet in near-real-time:
1. Create a Google Apps Script Web App that accepts POST requests and appends to your sheet.
2. Add its URL to `.env.local`:
   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```

A template Apps Script is included in [`google-apps-script-template.js`](./google-apps-script-template.js).

### 5. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Add all environment variables from `.env.local` in Vercel's project settings.

---

## Project Structure

```
app/
  layout.tsx          # Root layout + SEO metadata + font loading
  page.tsx            # Home page (Server Component, ISR 60s)
  globals.css         # Global design system (brand tokens, typography, components)
  api/
    waitlist/route.ts  # POST — submit + dedup waitlist entry
    stats/route.ts     # GET  — aggregate counters (ISR 30s)
    pageview/route.ts  # POST — increment page view counter

components/
  HeroSection.tsx/.module.css    # Yellow hero with live counters + ticker
  WhyGberaSection.tsx/.module.css # 6-feature editorial grid
  WaitlistForm.tsx/.module.css    # Full form with validation + success state
  Footer.tsx/.module.css          # Dark footer

lib/
  supabase.ts      # Supabase client factory (anon + admin)
  constants.ts     # Faculties, zones, types

supabase-schema.sql  # Full DB setup — run once in Supabase SQL Editor
```

---

## Form Logic Summary

| Field | Required | Notes |
|-------|----------|-------|
| Email | ✅ | Validated, deduplicated |
| Phone | No | Nigerian format, optional |
| UI student? | ✅ | Yes/No toggle |
| Faculty | No | Shown only if student = Yes |
| Year/Level | No | Shown only if student = Yes |
| Graduated? | No | Shown only if student = Yes |
| Occupation | No | Shown only if student = No |
| Role interest | ✅ | Rider / Driver / Both |
| Uses keke? | ✅ | Yes/No |
| Uses Uber? | ✅ | Yes/No |
| Frequency | No | Daily / Several times / Rarely |
| Preferred zones | No | Multi-select chips |

On duplicate email: updates optional fields, returns existing position (no second entry created).

---

## Open Questions (from PRD §8)

Refer to [`Gbera — Product Requirements Document.html`](../Gbera%20%E2%80%94%20Product%20Requirements%20Document.html) for the full list of open questions to ratify with stakeholders.
