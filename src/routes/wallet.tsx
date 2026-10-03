import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Error — Hangman" },
      {
        name: "description",
        content:
          "The wallet connection failed, so the 3 SOL reward could not be delivered.",
      },
      { property: "og:title", content: "Error — Hangman" },
      {
        property: "og:description",
        content: "The wallet connection failed, so the reward could not be delivered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WalletErrorPage,
});

function WalletErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background px-8 py-14">
        <svg
          viewBox="0 0 120 120"
          className="mx-auto h-20 w-20 stroke-foreground"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="46"
            className="draw-line"
            pathLength={1}
            fill="none"
            strokeWidth="3"
          />
          <line
            x1="42"
            y1="42"
            x2="78"
            y2="78"
            className="draw-line"
            pathLength={1}
            strokeWidth="3"
            style={{ animationDelay: "300ms" }}
          />
          <line
            x1="78"
            y1="42"
            x2="42"
            y2="78"
            className="draw-line"
            pathLength={1}
            strokeWidth="3"
            style={{ animationDelay: "420ms" }}
          />
        </svg>

        <p className="reveal-mask-tight mt-8">
          <span
            className="reveal-rise font-display text-6xl leading-none font-bold tracking-tight uppercase sm:text-7xl"
            style={{ animationDelay: "180ms" }}
          >
            Error
          </span>
        </p>

        <p className="reveal-mask-tight mt-6">
          <span
            className="reveal-rise text-sm font-semibold tracking-[0.2em] text-foreground uppercase"
            style={{ animationDelay: "420ms" }}
          >
            Wallet connection failed
          </span>
        </p>

        <p
          className="text-rise mt-3 text-sm text-muted-foreground"
          style={{ animationDelay: "560ms" }}
        >
          The reward could not be sent. Try again later.
        </p>

        <Link
          to="/game"
          className="text-rise mt-10 inline-flex items-center justify-center rounded-md border border-border px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors hover:border-foreground hover:text-foreground"
          style={{ animationDelay: "700ms" }}
        >
          Back to game
        </Link>
      </div>
    </main>
  );
}
