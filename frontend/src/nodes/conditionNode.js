import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const ConditionNode = ({ id }) => {
  return (
    <BaseNode
      title="Condition"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-input` },
        { type: "source", position: Position.Right, id: `${id}-true`, style: { top: "33%" } },
        { type: "source", position: Position.Right, id: `${id}-false`, style: { top: "66%" } },
      ]}
    >
      <div style={{ color: "#a5f3fc", fontSize: 12, fontWeight: 500 }}>Routes flow based on a condition.</div>
    </BaseNode>
  );
};
