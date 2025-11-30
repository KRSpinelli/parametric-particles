import { useState, useRef } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';
import Particles from "./components/Particles";
import ControlPanel from "./components/ControlPanel";
import { defaultParticleSettings } from './config/particleConfig';
import './App.css'

function App() {
  const [formula, setFormula] = useState('50');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [size, setSize] = useState(defaultParticleSettings.size);
  const [drawSpeed, setDrawSpeed] = useState(defaultParticleSettings.drawSpeed);
  const [xDrift, setXDrift] = useState(defaultParticleSettings.xDrift);
  const [yDrift, setYDrift] = useState(defaultParticleSettings.yDrift);
  const [driftDelay, setDriftDelay] = useState(defaultParticleSettings.driftDelay);
  const [lifespan, setLifespan] = useState(defaultParticleSettings.lifespan);
  const [damping, setDamping] = useState(defaultParticleSettings.damping);
  const [hueMin, setHueMin] = useState(0);
  const [hueMax, setHueMax] = useState(defaultParticleSettings.hueMax);
  const particlesRef = useRef(null);
  const [particleVelocity, setParticleVelocity] = useState(defaultParticleSettings.particleVelocity);
  const [emitterRateNumParticles, setEmitterRateNumParticles] = useState(defaultParticleSettings.emitterRateNumParticles);
  const [emitterRateTime, setEmitterRateTime] = useState(defaultParticleSettings.emitterRateTime);

  const handleHueChange = (min, max) => {
    setHueMin(min);
    setHueMax(max);
    console.log("Hue changed to ->", hueMin, hueMax);
  };

  const resetSettings = () => {
    setSize(defaultParticleSettings.size);
    setDrawSpeed(defaultParticleSettings.drawSpeed);
    setXDrift(defaultParticleSettings.xDrift);
    setYDrift(defaultParticleSettings.yDrift);
    setDriftDelay(defaultParticleSettings.driftDelay);
    setLifespan(defaultParticleSettings.lifespan);
    setDamping(defaultParticleSettings.damping);
    setParticleVelocity(defaultParticleSettings.particleVelocity);
    setEmitterRateNumParticles(defaultParticleSettings.emitterRateNumParticles);
    setEmitterRateTime(defaultParticleSettings.emitterRateTime);
  };

  return (
    <div className="App">
      <Particles
        ref={particlesRef}
        size={size}
        drawSpeed={drawSpeed}
        formula={formula}
        xDrift={xDrift}
        yDrift={yDrift}
        driftDelay={driftDelay}
        lifespan={lifespan}
        damping={damping}
        hueMin={hueMin}
        hueMax={hueMax}
        particleVelocity={particleVelocity}
        emitterRateNumParticles={emitterRateNumParticles}
        emitterRateTime={emitterRateTime}
      />

      {!isPanelOpen && (
        <div className="button-container">
          <button
            className="gear-button"
            onClick={() => setIsPanelOpen(true)}
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

      {isPanelOpen && (
        <>
          <ControlPanel formula={formula} setFormula={setFormula}
            isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen}
            size={size} setSize={setSize}
            drawSpeed={drawSpeed} setDrawSpeed={setDrawSpeed}
            xDrift={xDrift} setXDrift={setXDrift}
            yDrift={yDrift} setYDrift={setYDrift}
            driftDelay={driftDelay} setDriftDelay={setDriftDelay}
            lifespan={lifespan} setLifespan={setLifespan}
            damping={damping} setDamping={setDamping}
            hueMin={hueMin} hueMax={hueMax}
            onHueChange={handleHueChange}
            particleVelocity={particleVelocity}
            setParticleVelocity={setParticleVelocity}
            resetSettings={resetSettings}
            emitterRateNumParticles={emitterRateNumParticles} setEmitterRateNumParticles={setEmitterRateNumParticles}
            emitterRateTime={emitterRateTime} setEmitterRateTime={setEmitterRateTime} />

          <div
            className="overlay"
            onClick={() => setIsPanelOpen(false)}
          />
        </>
      )}
    </div>
  )
}

export default App