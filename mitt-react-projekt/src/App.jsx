import { useReducer } from 'react';

// 1. Definiera initial state (samma som innan)
const initialState = {
  count: 0,
  step: 1,
};

// 2. Reducer-funktionen – här bor ALL logik för hur state ändras
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
        step: Number.isFinite(nextStep) ? nextStep : 1,
      };

    case 'reset':
      return initialState;

    default:
      return state; // viktigt – alltid returnera state om action är okänd
  }
}

export default function App() {
  // 3. useReducer ger oss state OCH dispatch-funktionen
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <h1>Enkel räknare med useReducer</h1>
      <p>Count: {state.count}</p>

      <button onClick={() => dispatch({ type: 'increment' })}>
        Öka
      </button>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        Minska
      </button>

      <button
        onClick={() => dispatch({ type: 'reset' })}
      >
        Reset
      </button>

      <label>
        Steg:
        <input
          type="number"
          value={state.step}
          onChange={(e) =>
            dispatch({ type: 'set_step', payload: e.target.value })
          }
        />
      </label>
    </div>
  );
}