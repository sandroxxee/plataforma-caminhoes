import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[] | { value: string; label: string }[];
  helper?: string | React.ReactNode;
  error?: string;
  optional?: boolean;
  emptyOptionText?: string;
}

export function Select({ label, options, helper, error, optional, emptyOptionText, id, ...props }: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}`;
  return (
    <div className="painel-field">
      <label htmlFor={selectId}>
        {label}
        {optional && <span className="optional-tag">(opcional)</span>}
      </label>
      <select id={selectId} {...props}>
        {emptyOptionText && <option value="" disabled>{emptyOptionText}</option>}
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
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
