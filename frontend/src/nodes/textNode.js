// textNode.js
import { useEffect, useMemo, useRef, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./baseNode";

function extractVariables(text) {
  // Matches {{ var }} and captures "var"
  const regex = /{{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*}}/g;
  const vars = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }

  return Array.from(vars);
}

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "");
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const variables = useMemo(() => extractVariables(text), [text]);

  const handles = useMemo(() => {
    // Create one left "target" handle per variable
    // Spread them vertically within the node
    const topPadding = 55; // below header area
    const bottomPadding = 18;
    const usable = 170 - topPadding - bottomPadding; // approximate content height
    const count = Math.max(variables.length, 1);
    const step = usable / count;

    return variables.map((v, i) => ({
      type: "target",
      position: Position.Left,
      id: `${id}-${v}`,
      style: {
        top: topPadding + step * i + step / 2,
      },
    }));
  }, [variables, id]);

  return (
    <BaseNode title="Text" minHeight={190} handles={handles}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: "#9ca3af", fontSize: 11 }}>
          Use <code>{"{{ variable_name }}"}</code> to define variables.
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text here..."
          style={{
            width: "100%",
            minHeight: 90,
            resize: "none",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #2b2f36",
            background: "#0b1220",
            color: "#e5e7eb",
            outline: "none",
            lineHeight: 1.4,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        />

        {variables.length > 0 && (
          <div style={{ color: "#9ca3af", fontSize: 11 }}>
            Variables: {variables.join(", ")}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
