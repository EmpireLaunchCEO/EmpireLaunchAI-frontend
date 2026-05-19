"use client";

import React, { createContext, useContext, useState } from 'react';

interface EmpireContextType {
  activeEmpireId: string;
  setActiveEmpireId: (id: string) => void;
}

const EmpireContext = createContext<EmpireContextType | undefined>(undefined);

export function EmpireProvider({ children }: { children: React.ReactNode }) {
  const [activeEmpireId, setActiveEmpireId] = useState('1');

  return (
    <EmpireContext.Provider value={{ activeEmpireId, setActiveEmpireId }}>
      {children}
    </EmpireContext.Provider>
  );
}

export function useEmpire() {
  const context = useContext(EmpireContext);
  if (context === undefined) {
    throw new Error('useEmpire must be used within an EmpireProvider');
  }
  return context;
}
