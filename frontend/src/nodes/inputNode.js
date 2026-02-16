// inputNode.js
import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  return (
    <BaseNode
      title="Input"
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
    >
      <div className="node-field">
        <div className="node-label">Name</div>
        <input
          className="node-input"
          type="text"
          name={`${id}-inputName`}
          id={`${id}-inputName`}
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </div>

      <div className="node-field">
        <div className="node-label">Type</div>
        <select
            className="node-select"
            name={`${id}-inputType`}
            id={`${id}-inputType`}
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
