# Reference implementation

`paper-kpop/` contains two modules from the completed CLAUDE POP film:

| File | What it contains |
|---|---|
| `core.js` | canvas engine, palette, paper textures, camera transform, math helpers |
| `type.js` | paper typography, sticker lettering, subtitle band |

These are **read-only reference**. Do not import them into the product. Port the ideas, not the coupling.

What is worth taking:

- the camera transform model (reset per shot, accumulate within a shot)
- the paper texture and torn-edge functions
- the type lockup and subtitle band behaviour
- the easing and timing helpers
- the palette structure

What is not worth taking:

- the global mutable state
- the film-specific scene code
- the lyrics and timeline coupling

The full scene code stays in the source project. It is the input to the canonical re-render test in Phase 1.
