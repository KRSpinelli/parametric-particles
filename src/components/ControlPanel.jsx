import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from 'react';
import ColorWheel from './ColorWheel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import compilePolarExpression from "../FormulaParser";

const validateFormula = (formulaToValidate) => {
    if (!formulaToValidate || formulaToValidate.trim() === '') {
        return false;
    }
    try {
        const result = compilePolarExpression(formulaToValidate);
        return result.ok;
    } catch (error) {
        console.log('Error validating formula: ', error);
        return false;
    }
}

const ControlPanel = ({ formula, setFormula,
    editorFormula, setEditorFormula,
    isPanelOpen, setIsPanelOpen,
    size, setSize,
    drawSpeed, setDrawSpeed,
    xDrift, setXDrift,
    yDrift, setYDrift,
    driftDelay, setDriftDelay,
    lifespan, setLifespan,
    damping, setDamping,
    hueMin, hueMax, onHueChange,
    particleVelocity, setParticleVelocity,
    resetSettings,
    saveSettings,
    loadSettings,
    emitterRateNumParticles, setEmitterRateNumParticles,
    emitterRateTime, setEmitterRateTime }) => {

    const heartFormula = '50*((sin(theta+pi)*sqrt(abs(cos(theta+pi))))/(sin(theta+pi)+(7/5))-(2*sin(theta+pi))+2)';
    const circleFormula = '50';
    const quadrifoliumFormula = '200*sin(2*theta)';
    const [activePreset, setActivePreset] = useState(null);
    const textareaRef = useRef(null);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            // Reset height to auto to get correct scroll height
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [editorFormula]);

    const handleEditorFormulaChange = (e) => {
        setEditorFormula(e.target.value);
        setActivePreset(null);
        if (validateFormula(e.target.value)) {
            setFormula(e.target.value);
        }
    }

    const handlePresetClick = (presetFormula, presetName) => {
        setEditorFormula(presetFormula);
        setFormula(presetFormula);
        setActivePreset(presetName);
    }
    return (
        <div className={`control-panel ${isPanelOpen ? 'open' : ''}`}>
            <div className="control-panel-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', position: 'relative' }}>
                    <h2>Settings</h2>
                    <button
                        className="close-button"
                        onClick={() => setIsPanelOpen(false)}
                        style={{ position: 'absolute', right: 0 }}
                    >
                        <CloseIcon sx={{ fontSize: 24 }} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px', gap: '8px' }}>
                    <button
                        className="reset-button"
                        onClick={resetSettings}
                    >
                        Reset to Defaults
                        <RestartAltIcon sx={{ fontSize: 14, marginLeft: '5px' }} />
                    </button>
                    <button
                        className="save-button"
                        onClick={saveSettings}
                    >
                        Save
                    </button>
                    <button
                        className="load-button"
                        onClick={loadSettings}
                    >
                        Load
                    </button>
                </div>
            </div>
            <div className="control-panel-content">
                <div className="control-panel-section" style={{ paddingBottom: '10px' }}>
                    <label htmlFor="formula-input" style={{ alignSelf: 'flex-start', textAlign: 'left', marginBottom: '20px' }}>Formula:</label>

                    <div className="formula-input-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <p style={{ width: '30px', marginRight: '10px', marginTop: 0, paddingTop: '12px' }}> r =</p>
                        <textarea
                            ref={textareaRef}
                            id="formula-input"
                            className={`formula-input ${editorFormula ? (validateFormula(editorFormula) ? 'valid' : 'invalid') : ''}`}
                            value={editorFormula}
                            onChange={handleEditorFormulaChange}
                            placeholder="e.g., r = 109 * sin(4θ) + 271"
                            rows="1"
                        />
                    </div>


                    <label htmlFor="formula-input" style={{ alignSelf: 'flex-start', textAlign: 'left', marginBottom: '10px', marginTop: '20px' }}>Presets:</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '5px' }}>
                        <button
                            className={`preset-button ${activePreset === 'circle' ? 'active' : ''}`}
                            onClick={() => handlePresetClick(circleFormula, 'circle')}
                        >
                            Circle
                        </button>
                        <button
                            className={`preset-button ${activePreset === 'heart' ? 'active' : ''}`}
                            onClick={() => handlePresetClick(heartFormula, 'heart')}
                        >
                            Heart
                        </button>
                        <button
                            className={`preset-button ${activePreset === 'quadrifolium' ? 'active' : ''}`}
                            onClick={() => handlePresetClick(quadrifoliumFormula, 'quadrifolium')}
                        >
                            Quadrifolium
                        </button>
                    </div>
                </div>
                <div className="control-panel-section" style={{ paddingBottom: '10px', paddingTop: '15px' }}>
                    {/* Multiply drawspeed by 100 for visual appeal. This is not an AI comment just fyi. */}
                    <label htmlFor="size-input" style={{ justifySelf: 'flex-start', textAlign: 'left' }}>Emitter Movement Speed: {Number(drawSpeed * 100).toFixed(0)}</label>
                    <input
                        id="draw-speed-input"
                        className="draw-speed-input"
                        type="range"
                        min="0.01"
                        max="0.10"
                        step="0.01"
                        value={drawSpeed}
                        onChange={(e) => setDrawSpeed(parseFloat(e.target.value))}
                    />

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <label style={{ justifySelf: 'flex-start', textAlign: 'left' }}>Emitter Rate (approx. particles per emission):</label>
                        <input
                            id="emitter-rate-num-particles-input"
                            className="emitter-rate-num-particles-input"
                            type="number"
                            min="1"
                            max="100"
                            value={emitterRateNumParticles}
                            onChange={(e) => setEmitterRateNumParticles(Number(e.target.value))}
                            style={{ width: '65px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <label style={{ justifySelf: 'flex-start', textAlign: 'left' }}>Time between emissions (seconds): </label>
                        <input
                            id="emitter-rate-time-input"
                            className="emitter-rate-time-input"
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={emitterRateTime}
                            onChange={(e) => setEmitterRateTime(Number(e.target.value))}
                            style={{ width: '45px' }}
                        />
                    </div>
                </div>
                <div className="control-panel-section" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ textAlign: 'left' }}>Color Range:</label>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ColorWheel
                            hueMin={hueMin}
                            hueMax={hueMax}
                            onHueChange={onHueChange}
                        />
                    </div>
                </div>

                <div className="control-panel-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '10px' }}>
                    <label htmlFor="size-input" style={{ justifySelf: 'flex-start', textAlign: 'left' }}>Size: {size}</label>
                    <input
                        id="size-input"
                        className="size-input"
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                    />
                    <label>Particle Velocity: {particleVelocity}</label>
                    <input
                        id="particle-velocity-input"
                        className="particle-velocity-input"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={particleVelocity}
                        onChange={(e) => setParticleVelocity(Number(e.target.value))}
                    />
                    <label>Lifespan (seconds): {lifespan}</label>
                    <input
                        id="lifespan-input"
                        className="lifespan-input"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={lifespan}
                        onChange={(e) => setLifespan(Number(e.target.value))}
                    />
                    <label htmlFor="damping-input" style={{ textAlign: 'left' }}>Damping: {Number(damping * 10000).toFixed(0)}</label>
                    <input
                        id="damping-input"
                        className="damping-input"
                        type="range"
                        min="0.0001"
                        max="0.001"
                        step="0.0001"
                        value={damping}
                        onChange={(e) => setDamping(Number(e.target.value))}
                    />

                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px', width: '100%' }}>
                    <label style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>Drift:</label>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '20px',
                        width: '100%'
                    }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                            <label htmlFor="drift-x" style={{ fontSize: '12px', marginBottom: '5px', width: '100%', textAlign: 'center' }}>X</label>
                            <input
                                id="drift-x"
                                type="number"
                                min="0"
                                max="50"
                                step="0.1"
                                value={xDrift}
                                onChange={(e) => setXDrift(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                            <label htmlFor="drift-y" style={{ fontSize: '12px', marginBottom: '5px', width: '100%', textAlign: 'center' }}>Y</label>
                            <input
                                id="drift-y"
                                type="number"
                                min="0"
                                max="50"
                                step="0.1"
                                value={yDrift}
                                onChange={(e) => setYDrift(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                            <label htmlFor="drift-delay" style={{ fontSize: '12px', marginBottom: '5px', width: '100%', textAlign: 'center' }}>Delay</label>
                            <input
                                id="drift-delay"
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={driftDelay}
                                onChange={(e) => setDriftDelay(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ControlPanel;