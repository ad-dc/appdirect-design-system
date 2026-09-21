# Showcase prompt — factory building blocks

Paste this into an agent (Cursor, Figma Slides, or this repo’s `/slides` deck) when you want to **show** the system, not explain the architecture doc.

Do **one slide per turn**. Do not dump the rest of the deck.

## Prompt

```
Show the building blocks of the AppDirect agentic production system — the surfaces an agent must traverse to ship product UI, not a process diagram.

1. Code-connected Figma components
   Figma components mapped to design-system React source (*.figma.tsx). Agents read real props and variants from Code Connect. They do not invent Button APIs from a screenshot.

2. Design tokens that emit adapters for n+1 consumers
   One token source. Emitters for Mantine, Tailwind, Vue, Figma, CSS variables, and the next runtime. The point is adapters, not a static palette.

3. A Next.js design system plus the prototype template, attached to metrics
   The Next.js DS is canonical correctness (wrappers and AppDirect complex components). The GitHub prototype template is the counter for new work. Component contracts ship with the kit; ds-audit writes prototype-audit.json; fleet rollup turns clones into evidence.

Render this as a single 16:9 slide. One idea only: these three surfaces are what automation stands on. Dark AppDirect navy field, Inter, one primary accent. Leave room for the next slide.
```

## Deck sequence (build next only when asked)

| # | Slide | One idea |
|---|---|---|
| 01 | **Building blocks** (this prompt) | Three surfaces, one factory |
| 02 | Code Connect | Figma component → DS source → agent-readable props |
| 03 | Token adapters | One source, n+1 emitters (Mantine, Tailwind, Vue, Figma, …) |
| 04 | DS + prototype + contracts | Next.js DS, template counter, contract metrics |
| 05 | Agent loop | Prompt in → those three surfaces → measured UI out |

Live render in this repo: `/slides` (slide 01 only). Prototype index links it as **Factory deck — slide 1**.

## Constraints the renderer must keep

- Canonical correctness is **DS component source**, not Figma and not `DESIGN.md`.
- V1 factory is a **checker** (`ds-audit` + contracts). Authoring factory is later.
- `PageContentHeader` is an AppDirect complex component.
- Do not mention CBP.
- Do not install Southleft / Specs / Pandya as the contract runtime.
