import { useState, useRef } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';
import Particles from "./components/Particles";
import ControlPanel from "./components/ControlPanel";
import './App.css'

function App() {
  const [formula, setFormula] = useState('50');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [size, setSize] = useState(1);
  const [drawSpeed, setDrawSpeed] = useState(0.01);
  const particlesRef = useRef(null);

  return (
    <div className="App">
      <Particles ref={particlesRef} size={size} speed={drawSpeed} formula={formula} />

      {!isPanelOpen && (
        <div className="button-container">
          <button
            className="gear-button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-label="Settings"
          >
            <SettingsIcon sx={{ fontSize: 24 }} />
          </button>
          <button
            className="clear-button"
            onClick={() => {
              if (particlesRef.current) {
                particlesRef.current.clearCanvas();
              }
            }}
          >
            <ClearIcon sx={{ fontSize: 24 }} />
          </button>
        </div>
      )}

      <ControlPanel formula={formula} setFormula={setFormula}
        isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen}
        size={size} setSize={setSize}
        drawSpeed={drawSpeed} setDrawSpeed={setDrawSpeed} />

      {isPanelOpen && (
        <div
          className="overlay"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  )
}

export default App