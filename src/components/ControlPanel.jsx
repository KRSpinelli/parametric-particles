import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';


const calculateRadius = (formula, theta) => {
    formula = formula.replaceAll('theta', theta);
    formula = formula.replaceAll('e', 'Math.E');
    formula = formula.replaceAll('sin', 'Math.sin');
    formula = formula.replaceAll('cos', 'Math.cos');
    formula = formula.replaceAll('tan', 'Math.tan');
    formula = formula.replaceAll('sqrt', 'Math.sqrt');
    formula = formula.replaceAll('abs', 'Math.abs');
    formula = formula.replaceAll('log', 'Math.log');
    formula = formula.replaceAll('exp', 'Math.exp');
    formula = formula.replaceAll('pi', 'Math.PI');


    let r = eval(formula);
    return r;
}

const validateFormula = (formulaToValidate) => {
    if (!formulaToValidate || formulaToValidate.trim() === '') {
        return false;
    }
    try {
        let originalFormula = formulaToValidate;
        formulaToValidate = formulaToValidate.replaceAll('theta', '');
        formulaToValidate = formulaToValidate.replaceAll('sin', '');
        formulaToValidate = formulaToValidate.replaceAll('cos', '');
        formulaToValidate = formulaToValidate.replaceAll('tan', '');
        formulaToValidate = formulaToValidate.replace('sqrt', '');
        formulaToValidate = formulaToValidate.replaceAll('abs', '');
        formulaToValidate = formulaToValidate.replaceAll('log', '');
        formulaToValidate = formulaToValidate.replaceAll('exp', '');
        formulaToValidate = formulaToValidate.replaceAll('pi', '');
        formulaToValidate = formulaToValidate.replaceAll('e', '');
        formulaToValidate = formulaToValidate.replaceAll('(', '');
        formulaToValidate = formulaToValidate.replaceAll(')', '');
        formulaToValidate = formulaToValidate.replaceAll('*', '');
        formulaToValidate = formulaToValidate.replaceAll('/', '');
        formulaToValidate = formulaToValidate.replaceAll('+', '');
        formulaToValidate = formulaToValidate.replaceAll('-', '');
        formulaToValidate = formulaToValidate.replaceAll('^', '');
        formulaToValidate = formulaToValidate.replaceAll('%', '');
        formulaToValidate = formulaToValidate.replaceAll(/\d/g, '');
        formulaToValidate = formulaToValidate.replaceAll('.', '');
        formulaToValidate = formulaToValidate.replaceAll(' ', '');

        let allCharactersValid = formulaToValidate === '';
        calculateRadius(originalFormula, 5);
        let radiusValid = true;

        return allCharactersValid && radiusValid;
    } catch (error) {
        console.log('Error validating formula: ', error);
        return false;
    }
}

const ControlPanel = ({ formula, setFormula,
    isPanelOpen, setIsPanelOpen,
    size, setSize,
    drawSpeed, setDrawSpeed }) => {
    const [editorFormula, setEditorFormula] = useState(formula);
    const handleEditorFormulaChange = (e) => {
        setEditorFormula(e.target.value);
        if (validateFormula(e.target.value)) {
            setFormula(e.target.value);
        }
    }
    return (
        <div className={`control-panel ${isPanelOpen ? 'open' : ''}`}>
            <div className="control-panel-header">
                <h2>Formula Editor</h2>
                <button
                    className="close-button"
                    onClick={() => setIsPanelOpen(false)}
                >
                    <CloseIcon sx={{ fontSize: 24 }} />
                </button>
            </div>
            <div className="control-panel-content">
                <label htmlFor="formula-input">Enter Formula:</label>
                <div className="formula-input-container" style={{ display: 'flex', flexDirection: 'row' }}>
                    <p style={{ width: '30px', marginRight: '10px' }}> r =</p>
                    <textarea
                        id="formula-input"
                        className={`formula-input ${editorFormula ? (validateFormula(editorFormula) ? 'valid' : 'invalid') : ''}`}
                        value={editorFormula}
                        onChange={handleEditorFormulaChange}
                        placeholder="e.g., r = 109 * sin(4θ) + 271"
                        rows="4"
                    />
                </div>
                <label htmlFor="size-input">Size: {size}</label>
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
                <label htmlFor="size-input">Draw Speed: {drawSpeed * 100}</label>
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
            </div>
        </div>
    );
}

export default ControlPanel;