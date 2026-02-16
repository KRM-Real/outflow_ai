from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Set, Tuple, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Ping": "Pong"}

class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

# ---------- Graph helpers ----------

def build_graph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Tuple[Set[str], Dict[str, List[str]], Dict[str, int]]:
    node_ids: Set[str] = set()
    for n in nodes:
        nid = n.get("id")
        if nid is not None:
            node_ids.add(str(nid))

    adj: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    indeg: Dict[str, int] = {nid: 0 for nid in node_ids}

    for e in edges:
        s = e.get("source")
        t = e.get("target")
        if s is None or t is None:
            continue
        s = str(s)
        t = str(t)

        if s in node_ids and t in node_ids:
            adj[s].append(t)
            indeg[t] += 1

    return node_ids, adj, indeg

def topo_sort_kahn(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Tuple[bool, List[str]]:
    node_ids, adj, indeg = build_graph(nodes, edges)
    queue = [nid for nid in node_ids if indeg[nid] == 0]
    order: List[str] = []

    while queue:
        cur = queue.pop()
        order.append(cur)
        for nxt in adj[cur]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                queue.append(nxt)

    is_dag = (len(order) == len(node_ids))
    return is_dag, order

def incoming_sources(edges: List[Dict[str, Any]], node_id: str) -> List[str]:
    srcs = []
    for e in edges:
        if str(e.get("target")) == str(node_id):
            s = e.get("source")
            if s is not None:
                srcs.append(str(s))
    return srcs

# ---------- Existing endpoint ----------

@app.post("/pipelines/parse")
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    is_dag, _ = topo_sort_kahn(payload.nodes, payload.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": is_dag}

# ---------- New: execution endpoint ----------

def node_type(node: Dict[str, Any]) -> str:
    # If missing, default to "unknown"
    t = node.get("type")
    return str(t) if t is not None else "unknown"

def node_data(node: Dict[str, Any]) -> Dict[str, Any]:
    d = node.get("data")
    return d if isinstance(d, dict) else {}

def execute_node(n: Dict[str, Any], inputs: List[Any]) -> Any:
    """
    Mock execution (fast + deterministic).
    """
    t = node_type(n)
    d = node_data(n)

    if t in ("customInput", "input"):
        name = d.get("inputName") or "input"
        value = d.get("value", f"<{name}>")
        return {"name": name, "value": value}

    if t in ("text",):
        text = d.get("text", "")
        # naive substitute: if inputs exist, append a short summary
        if inputs:
            return f"{text} | inputs={len(inputs)}"
        return text

    if t in ("llm",):
        prompt = d.get("prompt", "prompt")
        base = inputs[-1] if inputs else ""
        return f"LLM({prompt}): {base}"

    if t in ("transform",):
        base = inputs[-1] if inputs else ""
        return f"TRANSFORM({base})"

    if t in ("condition",):
        base = inputs[-1] if inputs else ""
        # return both branches as a dict
        return {"true": f"TRUE({base})", "false": f"FALSE({base})"}

    if t in ("api",):
        base = inputs[-1] if inputs else ""
        return {"status": 200, "data": f"API_RESULT({base})"}

    if t in ("fileSave",):
        base = inputs[-1] if inputs else ""
        filename = d.get("filename", "output.txt")
        fmt = d.get("format", "Text")
        return {"saved": True, "filename": filename, "format": fmt, "content": base}

    if t in ("customOutput", "output"):
        base = inputs[-1] if inputs else ""
        name = d.get("outputName") or "output"
        return {"name": name, "value": base}

    # fallback
    return {"type": t, "inputs": inputs}

@app.post("/pipelines/execute")
def execute_pipeline(payload: PipelinePayload):
    is_dag, order = topo_sort_kahn(payload.nodes, payload.edges)
    if not is_dag:
        return {
            "ok": False,
            "error": "Pipeline contains a cycle. Execution requires a DAG.",
            "execution_order": order,
        }

    # id -> node
    node_map: Dict[str, Dict[str, Any]] = {str(n.get("id")): n for n in payload.nodes if n.get("id") is not None}

    results: Dict[str, Any] = {}

    for nid in order:
        n = node_map.get(nid)
        if not n:
            continue

        srcs = incoming_sources(payload.edges, nid)
        in_vals = [results[s] for s in srcs if s in results]

        results[nid] = execute_node(n, in_vals)

    # pick "final" nodes (no outgoing edges)
    has_out: Set[str] = set()
    for e in payload.edges:
        s = e.get("source")
        if s is not None:
            has_out.add(str(s))

    final_nodes = [nid for nid in order if nid not in has_out]
    final_outputs = {nid: results.get(nid) for nid in final_nodes}

    return {
        "ok": True,
        "execution_order": order,
        "results": results,
        "final_outputs": final_outputs,
    }
