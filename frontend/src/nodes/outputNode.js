// outputNode.js
import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <BaseNode
      title="Output"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-value` },
      ]}
    >
      <div className="node-field">
        <div className="node-label">Name</div>
        <input
          className="node-input"
          type="text"
          name={`${id}-outputName`}
          id={`${id}-outputName`}
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </div>

      <div className="node-field">
        <div className="node-label">Type</div>
        <select
          className="node-select"
          name={`${id}-outputType`}
          id={`${id}-outputType`}
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
