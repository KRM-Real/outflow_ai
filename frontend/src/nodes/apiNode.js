import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const APINode = ({ id }) => {
  return (
    <BaseNode
      title="API"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-input` },
        { type: "source", position: Position.Right, id: `${id}-output` },
      ]}
    >
      <div style={{ color: "#a5f3fc", fontSize: 12, fontWeight: 500 }}>Calls an external API.</div>
    </BaseNode>
  );
};
