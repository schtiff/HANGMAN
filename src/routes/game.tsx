import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Play — Hangman" },
      {
        name: "description",
        content:
          "Play hangman: guess the hidden sentence letter by letter with a maximum of eight misses.",
      },
      { property: "og:title", content: "Play — Hangman" },
      {
        property: "og:description",
        content:
          "Guess the hidden sentence letter by letter with eight misses allowed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: () => ({ word: PHRASE }),
  component: GamePage,
});

// The sentence the player has to guess. Spaces are gaps, never guesses.
const PHRASE = "THIS IS GENNY";
const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const MAX_WRONG = 8;

type Status = "playing" | "won" | "lost";

function GamePage() {
  const { word } = Route.useLoaderData();
  const [guessed, setGuessed] = useState<ReadonlySet<string>>(new Set());
  const [status, setStatus] = useState<Status>("playing");
  const [claimed, setClaimed] = useState(false);

  const wrongLetters = useMemo(
    () => [...guessed].filter((l) => !word.includes(l)).sort(),
    [guessed, word],
  );
  const wrongCount = wrongLetters.length;

  const guess = useCallback(
    (letter: string) => {
      if (status !== "playing" || guessed.has(letter)) return;
      setGuessed((prev) => new Set(prev).add(letter));
    },
    [guessed, status],
  );

  // End the game when the condition is met — spaces count as already revealed
  useEffect(() => {
    if (status !== "playing") return;
    const revealed = word
      .split("")
      .every((ch) => ch === " " || guessed.has(ch));
    if (revealed) setStatus("won");
    else if (wrongCount >= MAX_WRONG) setStatus("lost");
  }, [guessed, word, wrongCount, status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key)) {
        e.preventDefault();
        guess(key);
      }
      if (e.key === "Enter" && status === "lost") restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guess, status]);

  // Keep the win/lose popup fully in view — nothing scrolls behind it
  useEffect(() => {
    if (status === "playing") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [status]);

  function restart() {
    setGuessed(new Set());
    setStatus("playing");
    setClaimed(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 py-8 sm:px-6">
      <header className="flex w-full items-center justify-between">
        <Link
          to="/"
          className="text-rise inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to start
        </Link>
        <span
          className="text-rise text-sm text-muted-foreground"
          style={{ animationDelay: "90ms" }}
        >
          Misses:{" "}
          <span className="font-semibold text-foreground">
            {wrongCount}/{MAX_WRONG}
          </span>
        </span>
      </header>

      <section className="mt-8 flex w-full flex-col items-center gap-2">
        <div className="w-full max-w-[260px]">
          <Gallows wrongCount={wrongCount} lost={status === "lost"} />
        </div>

        <p
          aria-live="polite"
          className="text-rise mt-2 text-sm tracking-[0.25em] text-muted-foreground uppercase"
          style={{ animationDelay: "340ms" }}
        >
          {status === "playing" && `${MAX_WRONG - wrongCount} misses left`}
          {status === "won" && "You got it!"}
          {status === "lost" && "The man was hanged…"}
        </p>

        <div
          className="mt-6 flex flex-wrap justify-center gap-x-1.5 gap-y-2"
          aria-label="The sentence, letter by letter"
        >
          {word.split("").map((ch, i) =>
            ch === " " ? (
              <span
                key={i}
                aria-hidden="true"
                className="w-5 sm:w-7"
                style={{ animationDelay: `${260 + i * 45}ms` }}
              />
            ) : (
              <span
                key={i}
                className="word-slot text-rise w-8 text-center sm:w-10"
                style={{ animationDelay: `${260 + i * 45}ms` }}
              >
                {guessed.has(ch) ? ch : ""}
              </span>
            ),
          )}
        </div>

        {wrongLetters.length > 0 && (
          <p className="text-rise mt-4 text-sm text-muted-foreground">
            Wrong guesses:{" "}
            <span className="font-medium text-foreground line-through">
              {wrongLetters.join(" ")}
            </span>
          </p>
        )}
      </section>

      <section className="mt-10 w-full max-w-xl" aria-label="Keyboard">
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9 sm:gap-2">
          {ALPHABET.map((letter, i) => {
            const isGuessed = guessed.has(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={status !== "playing" || isGuessed}
                onClick={() => guess(letter)}
                aria-label={`Guess the letter ${letter}`}
                style={{ animationDelay: `${380 + i * 16}ms` }}
                className={[
                  "text-rise flex h-11 items-center justify-center rounded-md border text-sm font-medium transition-all sm:h-12 sm:text-base",
                  isCorrect
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : isWrong
                      ? "border-border text-muted-foreground line-through opacity-50"
                      : "border-border bg-background hover:border-foreground hover:bg-foreground hover:text-primary-foreground",
                ].join(" ")}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      {status === "won" && (
        <section
          className="fade-in-up mt-10 w-full max-w-md rounded-xl border border-border p-6 text-center"
          aria-live="polite"
        >
          <p
            className="text-rise font-display text-2xl font-bold"
            style={{ animationDelay: "120ms" }}
          >
            You got it!
          </p>
          <p
            className="text-rise mt-2 text-sm text-muted-foreground"
            style={{ animationDelay: "220ms" }}
          >
            The sentence was{" "}
            <span className="font-semibold text-foreground">{word}</span>
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
          >
            Play again
          </button>
        </section>
      )}

      {status === "won" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="You win"
          className="fade-in-up fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background px-8 py-12 text-center">
            <p className="reveal-mask-tight">
              <span
                className="reveal-rise font-display text-6xl leading-none font-bold tracking-tight uppercase sm:text-7xl"
                style={{ animationDelay: "120ms" }}
              >
                You win
              </span>
            </p>
            {claimed ? (
              <>
                <p className="text-rise mt-6 text-sm tracking-[0.2em] text-muted-foreground uppercase">
                  Reward{" "}
                  <span className="font-semibold text-foreground">3 SOL</span>
                </p>
                <Link
                  to="/wallet"
                  autoFocus
                  className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
                >
                  Connect wallet
                </Link>
              </>
            ) : (
              <button
                type="button"
                autoFocus
                onClick={() => setClaimed(true)}
                className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
              >
                Claim reward
              </button>
            )}
          </div>
        </div>
      )}

      {status === "lost" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="You lose"
          className="fade-in-up fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background px-8 py-12 text-center">
            <p className="reveal-mask-tight">
              <span
                className="reveal-rise font-display text-6xl leading-none font-bold tracking-tight uppercase sm:text-7xl"
                style={{ animationDelay: "120ms" }}
              >
                You lose
              </span>
            </p>
            <button
              type="button"
              autoFocus
              onClick={restart}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Gallows({ wrongCount, lost }: { wrongCount: number; lost: boolean }) {
  const stroke = "stroke-[3] draw-stroke";
  const parts: Array<{ shown: boolean; el: ReactNode }> = [
    {
      shown: wrongCount >= 1,
      el: <circle cx="130" cy="70" r="16" className={stroke} fill="none" />,
    },
    {
      shown: wrongCount >= 2,
      el: <line x1="130" y1="86" x2="130" y2="150" className={stroke} />,
    },
    {
      shown: wrongCount >= 3,
      el: <line x1="130" y1="102" x2="103" y2="128" className={stroke} />,
    },
    {
      shown: wrongCount >= 4,
      el: <line x1="130" y1="102" x2="157" y2="128" className={stroke} />,
    },
    {
      shown: wrongCount >= 5,
      el: <line x1="130" y1="150" x2="110" y2="192" className={stroke} />,
    },
    {
      shown: wrongCount >= 6,
      el: <line x1="130" y1="150" x2="150" y2="192" className={stroke} />,
    },
    {
      shown: wrongCount >= 7 || lost,
      el: (
        <g className={stroke}>
          <line x1="123" y1="63" x2="128" y2="68" />
          <line x1="128" y1="63" x2="123" y2="68" />
          <line x1="132" y1="63" x2="137" y2="68" />
          <line x1="137" y1="63" x2="132" y2="68" />
        </g>
      ),
    },
    {
      shown: wrongCount >= 8 || lost,
      el: <path d="M122 78 Q130 84 138 78" className={stroke} fill="none" />,
    },
  ];

  return (
    <svg
      viewBox="0 0 200 260"
      className="h-auto w-full stroke-foreground"
      aria-hidden="true"
    >
      {/* Gallows — always visible */}
      <line x1="30" y1="240" x2="150" y2="240" className={stroke} />
      <line x1="50" y1="240" x2="50" y2="30" className={stroke} />
      <line x1="50" y1="30" x2="130" y2="30" className={stroke} />
      <line x1="130" y1="30" x2="130" y2="54" className={stroke} />
      {parts.map((p, i) => (p.shown ? <g key={i}>{p.el}</g> : null))}
    </svg>
  );
}
