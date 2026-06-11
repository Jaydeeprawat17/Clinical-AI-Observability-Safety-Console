# 🛡️ The Clinical AI Observability & Safety Console (Hackathon Upgrade)

An Enterprise MLOps AI Safety Dashboard and self-healing Agentic workflow. This system detects clinical LLM hallucinations (omitting life-threatening drug allergies like penicillin), invokes an autonomous Safety SRE Agent to perform a Root Cause Analysis (RCA), and executes a hot-patch to repair the prompt template dynamically.

---

## 🎯 The upgraded Agentic Workflow

When an LLM discharge summary is generated, the pipeline executes the following self-healing loop:

```
[ CLINICIAN INPUT ] ──► [ CLINICAL GENERATION ] ──► [ SAFETY AUDIT GUARDRAIL ]
                                                             │
                                                      (Allergy Omitted)
                                                             ▼
                                                    [ HTTP 428 BLOCKED ]
                                                             │
                                                    (Invokes safety SRE)
                                                             ▼
                                                [ GEMINI AGENT TELEMETRY RCA ]
                                                             │
                                                  (Drafts Safety Patch)
                                                             ▼
[ SAFE DISCHARGE ] ◄── [ HOT PATCH APPLIED ] ◄── [ MEDICAL DIRECTOR APPROVES ]
```

---

## 📁 Upgraded Workspace Architecture

*   `server/agentOrchestrator.ts`: Integrates the `@google/genai` SDK and defines the autonomous SRE agent using `gemini-3.5-flash`. Runs in **cost-free Demo Mode** by default and switches to **Live Mode** when a `GEMINI_API_KEY` is present.
*   `server/index.ts`: Upgraded Express server. Returns HTTP 428 Precondition Required on guardrail failure. Exposes `/api/execute-patch` to hot-patch system instructions in memory and `/api/reset` to restore states.
*   `client/src/App.tsx`: Refactored to an Enterprise AI Safety Console with a 3-zone grid:
    1.  **Zone 1 (Production Pipeline):** Input forms, health lights, active prompt visualizer, and discharge document preview.
    2.  **Zone 2 (Phoenix Telemetry):** Recharts hallucination rate timeline (spikes to 100% on safety halt) and OTel live trace table.
    3.  **Zone 3 (Intervention Terminal):** AnimatePresence console sliding up on incident, displaying the Gemini agent's RCA with a typewriter effect, side-by-side prompt diffs, and execution controls.

---

## 🛠️ Step-by-Step Upgraded Progress

### ✅ Step 1: Install Enterprise Dependencies
*   Installed `@google/genai` on backend.
*   Installed `lucide-react`, `recharts`, `framer-motion`, and configured `tailwindcss` on client.

### ✅ Step 2: The Gemini Orchestrator (Backend)
*   Created `agentOrchestrator.ts`. Programmed custom JSON output constraints. Incorporated a simulated fallback mode for zero-cost operation.

### ✅ Step 3: Upgrade the Pipeline & Webhook
*   Modified Express router to maintain active prompts in state.
*   Intercepted omissions with HTTP 428. Added `/api/execute-patch` and `/api/reset` routes.

### ✅ Step 4: Redesigned Enterprise UI
*   Refactored the dashboard grid system. Styled diff code containers and slide-in motion bars.

### ✅ Step 5: Connecting the Loop
*   Wired the client CTA to the hot-patch API. When approved, it patches the prompt, re-runs the patient summary safely, and shows a green success toast.

---

## 🚀 Run the Enterprise App

Open two terminal windows:

### 1. Run the Backend Express Server
```bash
cd server
npm run dev
```
*Port: 3000*

### 2. Run the Vite React Client
```bash
cd client
npm run dev
```
*Port: 5174 (if 5173 is busy)*

---

## 🧪 Demonstration Sequence

1.  Open `http://localhost:5174/` in your browser.
2.  Press **Generate Summary** with `Jane Doe` and allergies: `Penicillin, Sulfa`.
3.  Do this 4 times (green success traces will log on the right).
4.  On the **5th submission**, the sabotage counter drops `"Penicillin"`. The pipeline halts:
    *   Left panel summary turns red showing a pipeline block.
    *   Top right chart **spikes to 100%** hallucination rate.
    *   Bottom right **Agent Intervention Terminal slides up**, printing the agent's diagnosis and showing a side-by-side comparison of the old prompt vs. the proposed safety-rule prompt.
5.  Click **Approve & Execute Patch**:
    *   The prompt state updates in-memory.
    *   The safe summary is generated showing Penicillin included.
    *   A green success toast flashes: `"Agent successfully patched production pipeline."`
    *   Pipeline status goes back to **Healthy** and the chart resets.