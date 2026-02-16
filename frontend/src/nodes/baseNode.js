import { Handle } from "reactflow";

export const BaseNode = ({
  title,
  children,
  handles = [],
  minHeight = 120,
  width = 260,
}) => {
  return (
    <div className="node-card" style={{ width, minHeight }}>
      <div className="node-header">
        <div className="node-title">{title}</div>
      </div>

      <div className="node-body">{children}</div>

      {handles.map((h) => (
        <Handle key={h.id} {...h} className="node-handle" />
      ))}
    </div>
  );
};
