import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string | React.ReactNode;
  error?: string;
  optional?: boolean;
}

export function Input({ label, helper, error, optional, id, ...props }: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
  return (
    <div className="painel-field">
      <label htmlFor={inputId}>
        {label}
        {optional && <span className="optional-tag">(opcional)</span>}
      </label>
      <input id={inputId} {...props} />
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
