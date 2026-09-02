# Features

Each feature directory owns:

- `*.slice.js` — Redux Toolkit slice for local UI state.
- `*.api.js` — RTK Query endpoints (via `apiSlice.injectEndpoints`).
- `components/` — feature-scoped components.
- `hooks/` — feature-scoped hooks.

Populated in later phases:

- `auth/` — Phase 2
- `users/` — Phase 3
- `conversations/` — Phase 4
- `messages/` — Phase 4 & 6
- `chat/` — Phase 4 (real-time glue)
- `groups/` — Phase 5
