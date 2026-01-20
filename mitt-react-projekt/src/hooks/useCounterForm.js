// src/hooks/useCounterForm.js
import { useState, useRef, useEffect } from 'react';

export function useCounterForm(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const stepInputRef = useRef(null);
  const lastValidStepRef = useRef(initialStep);

  // Uppdatera ref:en varje gång step ändras (utan re-render)
  useEffect(() => {
    lastValidStepRef.current = step;
  }, [step]);

  const focusInput = () => {
    stepInputRef.current?.focus();
    stepInputRef.current?.select();
  };

  const logLastValidStep = () => {
    const value = lastValidStepRef.current;
    console.log('Senaste giltiga step från custom hook:', value);
    alert(`Senaste giltiga step: ${value}`);
  };

  // Returnera ett objekt med allt vi behöver
  return {
    step,
    setStep,
    stepInputRef,
    focusInput,
    logLastValidStep,
  };
}