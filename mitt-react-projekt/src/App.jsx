import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <div>
      <h1>Enkel räknare:</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + step)}>Öka</button>
      <button onClick={() => setCount(count - step)}>Minska</button>
      <button onClick={() => {
        setCount(0);
        setStep(1);
      }}>Reset</button>
      <input 
        type="number" 
        value={step} 
        onChange={(e) => setStep(Number(e.target.value) || 1)} 
      />
    </div>
  );
}