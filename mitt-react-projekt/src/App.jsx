import { useReducer, useRef } from 'react';

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

export default function App() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  // 1. useRef för DOM-referens till input-fältet
  const stepInputRef = useRef(null);

  // 2. useRef för att "komma ihåg" det senaste giltiga step-värdet mellan renderingar
  const lastValidStepRef = useRef(state.step);

  // Uppdatera ref:en varje gång step ändras (men utan att trigga re-render)
  // Detta körs efter varje render
  lastValidStepRef.current = state.step;

  const focusStepInput = () => {
    if (stepInputRef.current) {
      stepInputRef.current.focus();
      // Bonus: markera texten så det är lätt att skriva över
      stepInputRef.current.select();
    }
  };

  const logLastStep = () => {
    // Här ser vi värdet som var senast – även om vi t.ex. skulle nollställa state.step
    console.log('Senaste giltiga step-värde (från ref):', lastValidStepRef.current);
    alert(`Senaste giltiga step: ${lastValidStepRef.current}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Räknare med useReducer + useRef</h1>

      <p>
        Count: <strong>{state.count}</strong>
      </p>

      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => dispatch({ type: 'increment' })}>Öka</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Minska</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <label>
          Steg:
          <input
            ref={stepInputRef}                     // ← här kopplar vi ref:en
            type="number"
            value={state.step}
            onChange={(e) =>
              dispatch({ type: 'set_step', payload: e.target.value })
            }
            style={{ width: '80px', marginLeft: '0.5rem' }}
          />
        </label>

        <button
          onClick={focusStepInput}
          style={{ marginLeft: '1rem' }}
        >
          Fokusera steg-input
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={logLastStep}>
          Logga senaste giltiga step-värde
        </button>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          (Klicka för att se värdet sparat i useRef – ändras inte vid reset)
        </p>
      </div>
    </div>
  );
}