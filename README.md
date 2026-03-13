## Ghoul Directory

Tokyo Ghoul character directory built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **next-themes**.  
It fetches character data from the public **Jikan API** and displays:

- A **character grid** on the home page
- A **character detail** page at `/character/[id]`
- A **skeleton loading** state
- A **dark/light mode toggle**

This README explains how the implementation is structured and how to rebuild it step by step just by reading the code.

---

## 1. Getting started

### Install & run

```bash
pnpm install # or npm install / yarn

npm run dev
# or: pnpm dev
```

The app runs at `http://localhost:3000`.

---

## 2. High‑level architecture

- `src/app/layout.tsx` – Root layout, global fonts, theme provider, header.
- `src/app/page.tsx` – Home page, fetches and displays Tokyo Ghoul characters.
- `src/app/loading.tsx` – Route-level skeleton while the home page loads.
- `src/app/character/[id]/page.tsx` – Character detail page.
- `src/components/header.tsx` – Top navigation bar with title and theme toggle.
- `src/components/mode-toggle.tsx` – Dark/light mode switch using `next-themes`.
- `src/app/globals.css` – Tailwind v4 + shadcn theme styles.
- `next.config.ts` – Enables React Compiler and configures remote image domains.

---

## 3. Root layout and theming

**File:** `src/app/layout.tsx`

Key ideas:

- Uses **Next.js App Router** root `RootLayout` to wrap every page.
- Imports Google fonts (`Geist`, `Geist_Mono`) and `./globals.css`.
- Wraps the app with `ThemeProvider` from `next-themes` so dark/light theme is applied via CSS classes.
- Renders a shared `Header` above all pages.

Important parts:

- `<html lang="en" suppressHydrationWarning>` – avoids theme class hydration warnings.
- `<body className="...">` – applies font variables and base typography.
- `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` – hooks `next-themes` into the DOM by toggling a `class` on `<html>`.

If you were to re‑implement this:

1. Import metadata, fonts, global CSS, `Header`, and `ThemeProvider` from `next-themes`.
2. Declare `RootLayout` that returns `<html><body><ThemeProvider><Header />{children}</ThemeProvider></body></html>`.
3. Add `suppressHydrationWarning` to `<html>` to play nicely with theme changes.

---

## 4. Header and dark mode toggle

### 4.1 Header

**File:** `src/components/header.tsx`

- Marked as a client component: `"use client";`.
- Renders a sticky top bar with:
  - A `Link` to `/` labeled `ANTEIKU DB`.
  - The `ModeToggle` component on the right.

This is where the user can switch between light and dark themes.

### 4.2 Mode toggle

**File:** `src/components/mode-toggle.tsx`

Responsibilities:

- Integrate with `next-themes` to:
  - Read current theme via `theme` / `resolvedTheme`.
  - Switch between `"light"` and `"dark"` via `setTheme`.
- Avoid React hydration mismatches by only rendering on the client.

Key implementation details:

- `"use client";` – it uses React hooks and browser APIs.
- `const [mounted] = useState(() => typeof window !== "undefined");`
  - Initializes `mounted` to `false` on the server and `true` on the client.
  - If `!mounted`, returns `null` so nothing is rendered on the server.
  - This prevents differences between server HTML and client HTML.
- `const currentTheme = resolvedTheme || theme;`
- `const isDark = currentTheme === "dark";`
- Button click toggles the theme:

```ts
onClick={() => setTheme(isDark ? "light" : "dark")}
```

To rebuild from scratch:

1. Create a client component.
2. Use `useTheme` from `next-themes` to read and set the theme.
3. Use the `mounted` pattern above to avoid hydration warnings.
4. Render a button whose label and behavior depend on `isDark`.

---

## 5. Home page: character directory

**File:** `src/app/page.tsx`

This is a **client component** (uses `useEffect` and `useState`), marked with `'use client';`.

### 5.1 Types

The file defines a `CharacterItem` type that matches the Jikan character API response slice used in the app:

- `character.mal_id` – unique ID (used as React key).
- `character.name` – character name.
- `character.images.webp.image_url` – URL to character image.
- Optional `role` – displayed under the name.

### 5.2 State and data fetching

- `const [characters, setCharacters] = useState<CharacterItem[]>([]);`
- `const [loading, setLoading] = useState<boolean>(true);`
- Fetch URL: `https://api.jikan.moe/v4/anime/1195/characters`.

`useEffect` logic:

1. `fetch(url)`.
2. `res.json()` to parse JSON.
3. `setCharacters(data.data.slice(0, 12));` to keep a manageable grid.
4. `setLoading(false)` whether the fetch succeeds or fails (with error logged).

### 5.3 Rendering

- If `loading` is `true`, return `<Loading />` (see section 6).
- Otherwise:
  - Render a `<main>` with background colors that react to the theme.
  - Show an `h1` title “Tokyo Ghoul Directory”.
  - Render a responsive grid:
    - `grid grid-cols-1 md:grid-cols-4 gap-6`.
    - For each `char`:
      - A card with a `next/image` optimized image (using the remote URLs from Jikan).
      - Title (name) and subtitle (role or `"Unknown"`).

How to rewrite it:

1. Mark the file as a client component: `'use client';`.
2. Define a type for the character items.
3. Set up state for characters and loading.
4. Use `useEffect` to fetch, parse, and store the data.
5. Render a skeleton or spinner while loading; render the grid afterward.

---

## 6. Route-level loading UI

**File:** `src/app/loading.tsx`

Next.js App Router automatically uses `loading.tsx` for `src/app` as the **route-level loading state** for the root segment.

Implementation:

- Default export function `Loading()` (important for Next to recognize it).
- Uses shadcn `Skeleton` primitives from `@/components/ui/skeleton`:
  - A header bar skeleton.
  - A grid of 8 card skeletons to mimic the home page layout.

Rebuild steps:

1. Create `src/app/loading.tsx`.
2. Export `default function Loading() { ... }`.
3. Use the same grid structure as the home page but replace contents with skeleton elements.

---

## 7. Character detail page

**File:** `src/app/character/[id]/page.tsx`

This dynamic route shows detailed information for a single character.

### 7.1 Data and types

- `useParams()` from `next/navigation` gets the `id` from the URL: `/character/[id]`.
- `Character` type defines the subset of fields used:
  - `images.webp.image_url`
  - `name`
  - `name_kanji?`
  - `about?`
- State: `const [character, setCharacter] = useState<Character | null>(null);`

### 7.2 Fetching character details

Inside `useEffect`:

1. Build URL: `https://api.jikan.moe/v4/characters/${(params as { id: string }).id}/full`.
2. Fetch and parse JSON.
3. Set `character` to `data.data`.

### 7.3 Layout

- If `character` is `null`, show a simple loading message.
- Once loaded:
  - Main wrapper: `max-w-4xl mx-auto`.
  - Back button: `<Link href="/">` wrapping a styled `<button>` saying “← Back to Directory”.
  - Flex layout:
    - Left: `next/image` with fixed width/height and `flex-shrink-0` so long text does not distort it.
    - Right:
      - Name heading.
      - Kanji name.
      - Biography text in a scrollable area:
        - `max-h-64 overflow-y-auto` – keeps very long bios in a neat scroll box.
        - `whitespace-pre-line` – preserves line breaks from the API text.

Rebuild steps:

1. Create `src/app/character/[id]/page.tsx` and mark as client component.
2. Use `useParams` to read `id`.
3. Define a `Character` type to describe the API shape.
4. Use `useEffect` to fetch and store the character data.
5. Render the two-column layout with image and text.

---

## 8. Remote images configuration

**File:** `next.config.ts`

Why: `next/image` only allows specific remote domains. Jikan’s images come from `myanimelist.net` and `cdn.myanimelist.net`, so those are explicitly whitelisted.

Key config:

- `reactCompiler: true` – enables the React Compiler.
- `images.remotePatterns` includes both hostnames.

To recreate:

1. Import `NextConfig` type from `"next"`.
2. Export `const nextConfig: NextConfig = { ... }`.
3. Set `reactCompiler: true` if desired.
4. Fill `images.remotePatterns` with the domains used by your API image URLs.

---

## 9. Running and extending

### Run

```bash
npm run dev
```

Open `http://localhost:3000`:

- See the Tokyo Ghoul character grid.
- Click a card to view the character detail page.
- Use the toggle in the header to switch between light and dark mode.

### Extend

Ideas:

- Add search or filters on the home page.
- Add pagination or “Load more” to fetch more than 12 characters.
- Show additional character info (age, species, affiliations) from the Jikan response.
- Add more UI components from shadcn/ui for richer layouts.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
