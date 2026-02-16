import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const PipelineNode = ({ id }) => {
  return (
    <BaseNode
      title="Pipeline"
      minHeight={120}
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in-1`, style: { top: "35%" } },
        { type: "target", position: Position.Left, id: `${id}-in-2`, style: { top: "70%" } },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <div style={{ color: "#9ca3af" }}>
        Combines multiple inputs into one stream.
      </div>
    </BaseNode>
  );
};
