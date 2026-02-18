# Outflow AI — Phase 1: Execution Engine (MVP)

Outflow AI Phase 1 ships a deterministic execution engine that runs React Flow pipelines end-to-end (no database, no auth, no real LLM provider calls). The goal is a reliable runtime, clear errors, and a usable “Run + Debug” experience in the UI.

## Phase 1 scope

### In scope

* Deterministic compilation + execution of DAG pipelines
* Strong validation (structure + DAG + handle bindings)
* Node registry + MVP built-in nodes (non-LLM)
* Run report: per-node status, timings, errors, final outputs
* Minimal frontend UX to run and inspect results
* Guardrails (limits + safe failure)

### Out of scope

* PostgreSQL / persistence / versioning
* Auth, teams, billing
* Queues / background workers / scheduling
* Real LLM integrations (OpenAI, etc.)

## Folder architecture target

```
repo/
  backend/
    app/
      main.py
      api/
        pipelines.py
      core/
        errors.py
        settings.py
      engine/
        models.py
        validate.py
        topo.py
        compile.py
        runtime.py
        nodes/
          registry.py
          input.py
          text.py
          transform.py
          condition.py
          pipeline.py
          output.py
    requirements.txt

  frontend/
    src/
      store.js
      submit.js
      ui.js
      nodes/
        ...
```

## Modules (do in this order)

### Module 1 — Backend restructure

**Goal:** stop growing `main.py` and create clean engine boundaries.

**Deliverables**

* `app/main.py` only wires FastAPI + routers
* `app/api/pipelines.py` owns `/pipelines/parse` and `/pipelines/execute`
* `engine/*` contains all graph + execution logic

**Acceptance**

* Backend runs exactly as before, but endpoints are routed via `api/pipelines.py`

**Checklist**

* [ ] Create `backend/app/` package layout
* [ ] Move current endpoints into `backend/app/api/pipelines.py`
* [ ] Keep CORS config in `backend/app/main.py`
* [ ] Add `__init__.py` where needed

**Branch**: `phase1/backend-structure`

---

### Module 2 — Strong graph validation

**Goal:** reject invalid graphs early with useful error messages.

**Deliverables**

* `engine/validate.py` returns `errors: []` with structured items:

  * `{ code, message, node_id?, edge_id?, detail? }`

**Validations**

* Node id missing / duplicated
* Edge missing source/target
* Edge references missing node
* DAG cycle detection
* Optional (recommended): handle id presence (sourceHandle/targetHandle)

**Acceptance**

* `/pipelines/parse` returns `{ ok: false, errors: [...] }` when invalid

**Checklist**

* [ ] Create `engine/models.py` for Node/Edge/PipelinePayload
* [ ] Add validation pipeline in `/pipelines/parse`
* [ ] Return errors with stable codes (for frontend mapping)

**Branch**: `phase1/graph-validation`

---

### Module 3 — Deterministic topo + compile plan

**Goal:** compile React Flow graph into a stable execution plan.

**Deliverables**

* `engine/topo.py` deterministic topo sort (stable ordering)
* `engine/compile.py` builds:

  * `order: [node_id]`
  * `inbound[node_id] = [ {src, srcHandle, dstHandle} ]`
  * `outbound[node_id] = [ ... ]`
  * `final_nodes = nodes with no outbound`

**Acceptance**

* Same graph always yields same `execution_order`

**Checklist**

* [ ] Replace nondeterministic queue `pop()` with stable ordering
* [ ] Compile inbound/outbound bindings including handles
* [ ] Extend `/pipelines/parse` to return `execution_order` when valid

**Branch**: `phase1/compile-plan`

---

### Module 4 — Runtime core + execution context

**Goal:** introduce a real engine loop with observability.

**Deliverables**

* `engine/runtime.py`:

  * `ExecutionContext(run_id, results, events)`
  * `execute(plan, node_map, registry) -> RunReport`
* Event model:

  * `NODE_START`, `NODE_SUCCESS`, `NODE_ERROR`
  * includes timestamps + duration

**Acceptance**

* `/pipelines/execute` returns `{ ok, run_id, execution_order, node_status, events, final_outputs }`

**Checklist**

* [ ] Implement `ExecutionContext`
* [ ] Implement event emission with timing
* [ ] Standardize error capture per node (node_id + message + code)

**Branch**: `phase1/runtime-context`

---

### Module 5 — Node registry + MVP built-in nodes

**Goal:** make node execution pluggable and extendable.

**Deliverables**

* `engine/nodes/registry.py` mapping `type -> handler`
* Handlers (MVP):

  * Input
  * Text (template render)
  * Transform (basic transforms)
  * Condition (simple rule-based)
  * Pipeline/Merge
  * Output

**Acceptance**

* You can build a pipeline: Input → Text → Transform → Output and get a stable result

**Checklist**

* [ ] Implement registry with `register()` and `get_handler(type)`
* [ ] Implement each node handler
* [ ] Define input gathering rules (by inbound bindings)

**Branch**: `phase1/node-registry-mvp`

---

### Module 6 — Frontend run + debug UX

**Goal:** UI reflects execution results.

**Deliverables**

* Zustand `lastRun` state:

  * `nodeStatus`, `finalOutputs`, `events`, `runId`
* Visual node status (border/badge)
* Error highlight of failing node

**Acceptance**

* Clicking **Execute** shows final outputs and marks nodes as ok/error

**Checklist**

* [ ] Extend `store.js` with `setLastRun(runReport)`
* [ ] Update `submit.js` to store report + display formatted output
* [ ] Style nodes based on status

**Branch**: `phase1/frontend-run-ux`

---

### Module 7 — Guardrails

**Goal:** safe limits and predictable failure.

**Deliverables**

* Max nodes/edges
* Max payload size / output size (truncate)
* Per-node timeout
* Better cycle error (include partial order + message)

**Acceptance**

* Large/invalid payloads fail fast with clear error codes

**Checklist**

* [ ] Add limits in validation step
* [ ] Add output truncation helper
* [ ] Add per-node timeout wrapper

**Branch**: `phase1/guardrails`

---

## Suggested PR sequence

1. `phase1/backend-structure`
2. `phase1/graph-validation`
3. `phase1/compile-plan`
4. `phase1/runtime-context`
5. `phase1/node-registry-mvp`
6. `phase1/frontend-run-ux`
7. `phase1/guardrails`

## Definition of Done (Phase 1)

* You can build a small pipeline in the UI and run it end-to-end.
* Backend returns deterministic `execution_order`.
* Each node has status + timing + error (if any).
* UI highlights failures and shows final outputs.
* No DB dependency.
