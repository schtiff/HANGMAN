import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

async function gameLoaderData() {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: ["/game"] }),
  });
  await router.load();
  return router.state.matches.at(-1)?.loaderData;
}

describe("Hangman answer", () => {
  it("hides the sentence THIS IS GENNY", async () => {
    expect(await gameLoaderData()).toEqual({ word: "THIS IS GENNY" });
  });

  it("keeps two spaces in the answer so they render as gaps, not guesses", async () => {
    const data = (await gameLoaderData()) as { word: string };
    expect([...data.word].filter((ch) => ch === " ")).toHaveLength(2);
    expect([...data.word].filter((ch) => ch !== " ")).toHaveLength(11);
  });
});
