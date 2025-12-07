import { useState, useRef, useEffect } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import ClearIcon from '@mui/icons-material/Clear';
import Particles from "./components/Particles";
import ControlPanel from "./components/ControlPanel";
import { defaultParticleSettings } from './config/particleConfig';
import './App.css'

function App() {
  const [formula, setFormula] = useState(defaultParticleSettings.formula);
  const [editorFormula, setEditorFormula] = useState(formula);
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

  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.clearCanvas();
    }
  }, [formula]);

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
    setFormula(defaultParticleSettings.formula);
    setHueMin(defaultParticleSettings.hueMin);
    setHueMax(defaultParticleSettings.hueMax);
  };

  const saveSettings = () => {
    const config = {
      formula,
      size,
      drawSpeed,
      xDrift,
      yDrift,
      driftDelay,
      lifespan,
      damping,
      hueMin,
      hueMax,
      particleVelocity,
      emitterRateNumParticles,
      emitterRateTime
    };

    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'particle-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const config = JSON.parse(event.target.result);
            if (config.formula !== undefined) {
              setFormula(config.formula);
              setEditorFormula(config.formula);
            }
            if (config.size !== undefined) setSize(config.size);
            if (config.drawSpeed !== undefined) setDrawSpeed(config.drawSpeed);
            if (config.xDrift !== undefined) setXDrift(config.xDrift);
            if (config.yDrift !== undefined) setYDrift(config.yDrift);
            if (config.driftDelay !== undefined) setDriftDelay(config.driftDelay);
            if (config.lifespan !== undefined) setLifespan(config.lifespan);
            if (config.damping !== undefined) setDamping(config.damping);
            if (config.hueMin !== undefined) setHueMin(config.hueMin);
            if (config.hueMax !== undefined) setHueMax(config.hueMax);
            if (config.particleVelocity !== undefined) setParticleVelocity(config.particleVelocity);
            if (config.emitterRateNumParticles !== undefined) setEmitterRateNumParticles(config.emitterRateNumParticles);
            if (config.emitterRateTime !== undefined) setEmitterRateTime(config.emitterRateTime);
          } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('Error loading config file. Please ensure it is valid JSON.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
            Clear
            {/* <ClearIcon sx={{ fontSize: 24 }} /> */}
          </button>
        </div>
      )}

      {isPanelOpen && (
        <>
          <ControlPanel formula={formula} setFormula={setFormula}
            editorFormula={editorFormula} setEditorFormula={setEditorFormula}
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
            saveSettings={saveSettings}
            loadSettings={loadSettings}
            emitterRateNumParticles={emitterRateNumParticles} setEmitterRateNumParticles={setEmitterRateNumParticles}
            emitterRateTime={emitterRateTime} setEmitterRateTime={setEmitterRateTime} />
          {/* 
          <div
            className="overlay"
            onClick={() => setIsPanelOpen(false)}
          /> */}
        </>
      )}
    </div>
  )
}

export default App