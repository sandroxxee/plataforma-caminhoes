import { useState } from "react";

export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [campos, setCampos] = useState<T>(initialState);

  const setCampo = (key: keyof T, value: any) => {
    setCampos((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setCamposMassa = (novosCampos: Partial<T>) => {
    setCampos((prev) => ({
      ...prev,
      ...novosCampos,
    }));
  };

  const limpar = () => {
    setCampos(initialState);
  };

  return {
    campos,
    setCampo,
    setCamposMassa,
    limpar,
    setCampos,
  };
}
