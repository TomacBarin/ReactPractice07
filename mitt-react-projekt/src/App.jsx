import { useReducer, useRef, useMemo, useCallback, memo } from 'react';

const initialState = {
  count: 0,
  step: 1,
};

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'set_step':
      const nextStep = Number(action.payload);
      return {
        ...state,
        step: Number.isFinite(nextStep) && nextStep !== 0 ? nextStep : 1,
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

// En barnkomponent som vi memoizerar för att visa poängen med useCallback
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
  const stepInputRef = useRef(null);
  const lastValidStepRef = useRef(state.step);

  lastValidStepRef.current = state.step;

  const focusStepInput = () => {
    stepInputRef.current?.focus();
    stepInputRef.current?.select();
  };

  const logLastStep = () => {
    alert(`Senaste giltiga step (från ref): ${lastValidStepRef.current}`);
  };

  // --- useMemo-exempel: dyr beräkning ---
  const expensiveSum = useMemo(() => {
    console.log('Beräknar dyr summa... (simulerad loop)');
    let sum = 0;
    // Simulerar en dyr operation (i verkligheten kanske filtrering/sortering av stor array)
    for (let i = 1; i <= state.count * 1000; i++) {
      sum += i;
    }
    return sum;
  }, [state.count]); // ← bara om count ändras

  // --- useCallback-exempel: stabil callback till barnkomponent ---
  const handleStepChange = useCallback((newStep) => {
    dispatch({ type: 'set_step', payload: newStep });
  }, []); // tom dependency → funktionen skapas bara en gång

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Räknare med useReducer + useRef + useMemo/useCallback</h1>

      <p>
        Count: <strong>{state.count}</strong>
      </p>
      <p>
        Summan av talen 1 till {state.count} × 1000:{' '}
        <strong>{expensiveSum.toLocaleString()}</strong>
      </p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        (Kolla konsolen – "Beräknar dyr summa..." ska bara loggas när count ändras)
      </p>

      <div style={{ margin: '1.5rem 0' }}>
        <button onClick={() => dispatch({ type: 'increment' })}>Öka</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Minska</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <label>
          Steg:
          <input
            ref={stepInputRef}
            type="number"
            value={state.step}
            onChange={(e) => dispatch({ type: 'set_step', payload: e.target.value })}
            style={{ width: '80px', marginLeft: '0.5rem' }}
          />
        </label>
        <button onClick={focusStepInput} style={{ marginLeft: '1rem' }}>
          Fokusera input
        </button>
      </div>

      <StepDisplay step={state.step} onStepChange={handleStepChange} />

      <div style={{ marginTop: '2rem' }}>
        <button onClick={logLastStep}>Logga senaste step (ref)</button>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        Tips: Ta bort useCallback runt handleStepChange och klicka Öka/Minska många gånger – kolla hur ofta "StepDisplay renderades" loggas i konsolen. Lägg sedan tillbaka useCallback → mycket färre renders!
      </p>
    </div>
  );
}