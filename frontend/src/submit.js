import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const wrapStyle = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 10,
};

const baseBtn = {
  padding: "9px 14px",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "#0f172a",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: 13,
};

const analyzeBtn = {
  ...baseBtn,
  background: "#111827",
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const callBackend = async (endpoint) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error (${res.status}): ${text}`);
      }

      return await res.json();
    } catch (err) {
      alert(`Request failed: ${err.message}`);
      return null;
    }
  };

  const handleAnalyze = async () => {
    const data = await callBackend("pipelines/parse");
    if (!data) return;

    alert(
      `Pipeline Analysis:\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag}`
    );
  };

  const handleExecute = async () => {
    const data = await callBackend("pipelines/execute");
    if (!data) return;

    if (!data.ok) {
      alert(`Execution Error:\n\n${data.error}`);
      return;
    }

    alert(
      `Execution Result:\n\nOrder:\n${data.execution_order.join(
        " → "
      )}\n\nFinal Outputs:\n${JSON.stringify(data.final_outputs, null, 2)}`
    );
  };

  return (
    <div style={wrapStyle}>
      <button onClick={handleAnalyze} style={analyzeBtn}>
        Analyze
      </button>
      <button onClick={handleExecute} style={baseBtn}>
        Execute
      </button>
    </div>
  );
};
