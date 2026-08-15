# Thumbnail Hover Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make icon and UI hover expansion smooth, bold, independent, and unclipped.

**Architecture:** Keep the interaction entirely in the existing CSS hover rules. Scale the icon inward from the left and the UI inward from the right so the visual emphasis becomes overlap rather than edge clipping.

**Tech Stack:** Plain CSS and Playwright verification; no build step or new dependency.

## Global Constraints

- Icon hover scale is exactly `1.18`.
- UI hover scale is exactly `1.10`.
- Transform and shadow transitions last 260 ms.
- Hover remains limited to fine pointers and changes only the hovered layer.
- Existing reduced-motion settings must not make this interaction instant.

---

### Task 1: Strengthen the independent hover interaction

**Files:**
- Modify: `style.css:158-183,250-256`
- Test: `C:/Users/osi_c/AppData/Local/Temp/crazy-entertainment-thumbnail-bugfix/verify-bugfix.cjs`

**Interfaces:**
- Consumes: existing `.thumbnail-layer--icon` and `.thumbnail-layer--ui` elements.
- Produces: CSS-only hover expansion for fine-pointer devices.

- [ ] **Step 1: Tighten the browser regression test**

Assert in the existing Playwright check that reduced-motion contexts report a non-zero transition duration, icon width reaches `1.18` times baseline, UI width reaches `1.10` times baseline, and the non-hovered sibling remains at baseline.

- [ ] **Step 2: Run the regression test and verify RED**

Run:

```powershell
& "C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-bugfix\verify-bugfix.cjs"
```

Expected: FAIL because the current scales are `1.08` and `1.035`, and reduced motion sets transition duration to zero.

- [ ] **Step 3: Apply the minimal CSS change**

Set the shared transition to 260 ms, set inward-facing transform origins, change icon hover to `scale(1.18)`, change UI hover to `scale(1.10)`, and remove the reduced-motion rule that disables these transitions.

- [ ] **Step 4: Run regression and visual verification**

Run the regression check above, followed by:

```powershell
& "C:\Users\osi_c\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\osi_c\AppData\Local\Temp\crazy-entertainment-thumbnail-bugfix\visual-check.cjs"
```

Expected: both commands exit zero; desktop and mobile report no broken images or overflow.

- [ ] **Step 5: Commit**

```powershell
git add style.css
git commit -m "style: strengthen thumbnail hover emphasis"
```
