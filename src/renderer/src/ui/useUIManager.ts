import { type ReactNode, useState } from 'react';

export function useUIManager() {
  const [domComponents, setDomComponents] = useState<ReactNode[]>([]);

  const addDOMUI = (c: ReactNode) => setDomComponents((prev) => [...prev, c]);
  const removeDOMUI = (c: ReactNode) =>
    setDomComponents((prev) => prev.filter((comp) => comp !== c));

  return {
    domComponents,
    addDOMUI,
    removeDOMUI
  };
}
