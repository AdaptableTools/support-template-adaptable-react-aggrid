# Manually Saving Layouts

By default, AdapTable persists Layouts as soon as they change. This demo makes Layout edits **temporary until explicitly saved**, and **discards unsaved changes when you leave a Layout**.

## Run the demo

```sh
npm install
npm run start
```

## Use case

1. **"First Layout"** has columns `A, B, C`
2. Reorder to `C, B, A`
3. Clone as **"Second Layout"** (keeps `C, B, A`)
4. Switch back to **"First Layout"** — it shows `A, B, C` again

## How to test

1. Open the demo on **Standard Layout**
2. Change the Layout (sort, reorder, or group columns)
3. **Clone Layout** and name it (e.g. "My Layout")
4. Switch back to **Standard Layout** — your changes from step 2 are gone
5. Switch to **My Layout** — those changes are still there

Also check:

- Persist CURRENT, then switch away and back — the change survives
- Change the Format Column on **GitHub Stars** and reload — non-Layout state still auto-saves
- Reload the page — only explicitly persisted Layouts are restored

## Buttons

| Button | Effect |
| --- | --- |
| **Persist ALL Layout changes** | Save every Layout |
| **Persist CURRENT Layout changes** | Save only the current Layout |
| **Undo Layout Changes** | Restore last saved Layouts |
| **Reset Layout Changes** | Restore initial Layouts |

## How it works

Two parts: **don't auto-save Layouts**, then **revert a Layout when you leave it**.

**1. Suppress auto-save.** A `lastPersistedLayoutState` snapshot holds the last explicitly saved Layouts. `stateOptions.persistState` always writes that snapshot instead of the running Layout state. Other objects (e.g. Format Column) still persist as usual.

**2. Revert on switch.** On `LayoutChanged` with `LAYOUT_SELECT`, the Layout being left is restored from the snapshot via `layoutApi.createOrUpdateLayout`. If it is not in the snapshot (e.g. a fresh clone), it is left as-is. The restore is deferred with `setTimeout` so it does not run mid-select.

**3. Persist / Undo / Reset.** Persist ALL replaces the snapshot with the full running Layout state. Persist CURRENT merges only the current Layout into the snapshot. Undo reloads the snapshot; Reset reloads the initial Layout state.

This only works with the custom `persistState` hook. In a default setup there is no "last saved" Layout to roll back to.

The implementation is in `src/AdaptableAgGrid/AdaptableAgGrid.tsx`.
