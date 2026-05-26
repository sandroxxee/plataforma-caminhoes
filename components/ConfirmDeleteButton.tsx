"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label?: string;
  message?: string;
};

function SubmitButton({ label = "Excluir" }: Pick<Props, "label">) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="confirm-delete-button" disabled={pending}>
      {pending ? "Excluindo..." : label}
      <style>{`
        .confirm-delete-button {
          border: 0;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(239,68,68,.16);
          color: #fecaca;
          font-weight: 900;
          cursor: pointer;
          font-family: inherit;
        }

        .confirm-delete-button:disabled {
          opacity: .7;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}

export function ConfirmDeleteButton({
  label = "Excluir",
  message = "Tem certeza que deseja excluir este anúncio? Essa ação não pode ser desfeita.",
}: Props) {
  return (
    <span
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <SubmitButton label={label} />
    </span>
  );
}
