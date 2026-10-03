<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules

- The start-page gallows is an inline SVG whose stroke coordinates were measured from the user's uploaded drawing, not the PNG file itself — that is what lets every stroke draw in one at a time on page open. Keep the mark inline in the route and animate it with the `draw-line` / `sway` utilities in `src/styles.css` instead of animating a raster image.
- The start page must fit the window without scrolling at both 1280x800 and 1077x854 — check element boxes and `document.body.scrollHeight` with a Playwright run after any change to that layout.
- Page-open text always animates with the reveal utilities in `src/styles.css` (`reveal-mask` + `reveal-rise` for display lines, `text-rise` for small text, keys and letter boxes), never a bare opacity fade; every one of them must stay disabled under `prefers-reduced-motion`.
- The hidden word comes from the `/game` route `loader`, never from a random pick inside a component initializer or render — a `Math.random()` during render makes server HTML and client markup differ, which fails hydration.
