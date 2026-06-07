"use client";

import React from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { LockedSlotView } from './Dashboard/LockedSlotView';

interface SlotGuardProps {
  children: React.ReactNode;
}

export function SlotGuard({ children }: SlotGuardProps) {
  const { activeEmpireId, slotStatus, isAdmin } = useEmpire();
  
  // Calculate slot index (0, 1, or 2)
  const slotIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));
  
  // Slot 1 (Index 0) is always unlocked by default for everyone.
  // Slots 2 and 3 require payment (slotStatus[index] === true) unless user is Admin.
  const isUnlocked = slotIndex === 0 || slotStatus[slotIndex] || isAdmin;

  if (!isUnlocked) {
    return <LockedSlotView slotIndex={slotIndex} />;
  }

  return <>{children}</>;
}
