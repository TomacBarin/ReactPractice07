import { useReducer, useMemo, useCallback, memo } from 'react';
import { useCounterForm } from './hooks/useCounterForm'; // ← importera hooken

const initialState = {
  count: 0,
  step: 1, // vi skickar inte längre step hit – hooken hanterar det
};

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + action.payload.step };
    case 'decrement':
      return { ...state, count: state.count - action.payload.step };
    case 'reset':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

// Barnkomponent (oförändrad)
const StepDisplay = memo(function StepDisplay({ step, onStepChange }) {
  console.log('StepDisplay renderades');
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <p>Aktuellt steg: <strong>{step}</strong></p>
      <button onClick={() => onStepChange(1)}>Sätt steg till 1</button>
      <button onClick={() => onStepChange(5)}>Sätt steg till 5</button>
    </div>
  );
});

export default function App() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  // Använd custom hooken!
  const {
    step,
    setStep,
    stepInputRef,
    focusInput,
    logLastValidStep,
  } = useCounterForm(1); // initialvärde 1

  const handleStepChange = useCallback((newStep) => {
    setStep(newStep);
  }, [setStep]);

  const expensiveSum = useMemo(() => {
    console.log('Beräknar dyr summa...');
    let sum = 0;
    for (let i = 1; i <= state.count * 1000; i++) {
      sum += i;
    }
    return sum;
  }, [state.count]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Räknare med Custom Hook!</h1>

      <p>Count: <strong>{state.count}</strong></p>
      <p>
        Summan av talen 1 till {state.count} × 1000:{' '}
        <strong>{expensiveSum.toLocaleString()}</strong>
      </p>

      <div style={{ margin: '1.5rem 0' }}>
        <button onClick={() => dispatch({ type: 'increment', payload: { step } })}>
          Öka
        </button>
        <button onClick={() => dispatch({ type: 'decrement', payload: { step } })}>
          Minska
        </button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <label>
          Steg:
          <input
            ref={stepInputRef}
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value) || 1)}
            style={{ width: '80px', marginLeft: '0.5rem' }}
          />
        </label>
        <button onClick={focusInput} style={{ marginLeft: '1rem' }}>
          Fokusera input
        </button>
      </div>

      <StepDisplay step={step} onStepChange={handleStepChange} />

      <div style={{ marginTop: '2rem' }}>
        <button onClick={logLastValidStep}>Logga senaste step (från hook)</button>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        All step-logik (input, ref, fokus, loggning) ligger nu i useCounterForm-hooken!
      </p>
    </div>
  );
}