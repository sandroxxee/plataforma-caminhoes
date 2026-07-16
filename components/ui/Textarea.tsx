import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string | React.ReactNode;
  error?: string;
  optional?: boolean;
}

export function Textarea({ label, helper, error, optional, id, ...props }: TextareaProps) {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
  return (
    <div className="painel-field">
      <label htmlFor={textareaId}>
        {label}
        {optional && <span className="optional-tag">(opcional)</span>}
      </label>
      <textarea id={textareaId} {...props} />
      {helper && (
        typeof helper === "string" ? (
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px", fontWeight: 700 }}>
            {helper}
          </span>
        ) : (
          helper
        )
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
