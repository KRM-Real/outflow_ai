// llmNode.js
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      title="LLM"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-system`, style: { top: "33%" } },
        { type: "target", position: Position.Left, id: `${id}-prompt`, style: { top: "66%" } },
        { type: "source", position: Position.Right, id: `${id}-response` },
      ]}
    >
      <div style={{ color: "#a5f3fc", fontSize: 12, fontWeight: 500 }}>Large Language Model</div>
    </BaseNode>
  );
};
