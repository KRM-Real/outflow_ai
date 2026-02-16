// fileSaveNode.js
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const FileSaveNode = ({ id }) => {
  return (
    <BaseNode
      title="File Save"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-input` },
      ]}
    >
      <div className="node-field">
        <div className="node-label">Description</div>
        <div style={{ fontSize: 12, color: "#cbd5e1" }}>
          Saves incoming data to a file.
        </div>
      </div>
    </BaseNode>
  );
};
