import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hangman — Play Now" },
      {
        name: "description",
        content:
          "Classic hangman in a clean black-and-white design. Guess the word before the man is hanged — eight misses and it's over.",
      },
      { property: "og:title", content: "Hangman — Play Now" },
      {
        property: "og:description",
        content: "Guess the word letter by letter before the man is hanged.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Stroke = { d: string; delay: number };

const FRAME: Stroke[] = [
  { d: "M38 349H141", delay: 0 },
  { d: "M90 19V349", delay: 140 },
  { d: "M83 26H277", delay: 300 },
  { d: "M90 100L159 32", delay: 460 },
];

const FIGURE: Stroke[] = [
  { d: "M270 26V97", delay: 620 },
  { d: "M228 139a42 42 0 1 0 84 0a42 42 0 1 0-84 0", delay: 760 },
  { d: "M270 181V295", delay: 960 },
  { d: "M270 207L204 229", delay: 1120 },
  { d: "M270 207L332 228", delay: 1200 },
  { d: "M270 292L231 331", delay: 1300 },
  { d: "M270 292L309 331", delay: 1380 },
];

function Strokes({ items }: { items: Stroke[] }) {
  return (
    <>
      {items.map((s) => (
        <path
          key={s.d}
          d={s.d}
          pathLength={1}
          className="draw-line"
          style={{ animationDelay: `${s.delay}ms` }}
        />
      ))}
    </>
  );
}

function Gallows({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 376 376"
      fill="none"
      role="img"
      aria-label="A stick figure hanging from a gallows"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Strokes items={FRAME} />
      </g>
      <g
        className="sway"
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Strokes items={FIGURE} />
      </g>
    </svg>
  );
}

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-background px-6 py-10 text-foreground">
      <h1 className="text-center font-display text-6xl leading-[0.92] font-bold tracking-tight sm:text-8xl lg:text-[7rem]">
        <span className="reveal-mask">
          <span
            className="reveal-rise"
            style={{ animationDelay: "180ms" }}
          >
            Hang
          </span>
        </span>
        <span className="reveal-mask">
          <span
            className="reveal-rise"
            style={{ animationDelay: "300ms" }}
          >
            Man
          </span>
        </span>
      </h1>

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-10 lg:gap-0">
        <Gallows className="w-36 lg:absolute lg:top-1/2 lg:w-80 lg:-translate-y-1/2 lg:left-[max(2rem,calc(50vw_-_504px))] xl:w-96 xl:left-[max(4rem,calc(50vw_-_568px))]" />

        <Link
          to="/game"
          aria-label="Play hangman"
          className="fade-in-up group flex h-28 w-60 items-center justify-center rounded-3xl bg-primary text-primary-foreground transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none sm:h-32 sm:w-72"
          style={{ animationDelay: "420ms" }}
        >
          <span className="flex flex-col items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-12 transition-transform duration-300 group-hover:translate-x-1.5 sm:size-14"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
            <span className="reveal-mask-tight">
              <span
                className="reveal-rise text-sm font-semibold tracking-[0.3em] uppercase"
                style={{ animationDelay: "560ms" }}
              >
                Play
              </span>
            </span>
          </span>
        </Link>

        <p className="reveal-mask-tight mt-5 text-base font-bold tracking-[0.14em] text-foreground uppercase">
          <span
            className="reveal-rise"
            style={{ animationDelay: "720ms" }}
          >
            can u guess the word? reward 3 SOL
          </span>
        </p>
      </div>
    </main>
  );
}
