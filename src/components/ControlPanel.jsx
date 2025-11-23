import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';


const calculateRadius = (formula, theta) => {
    formula = formula.replace('theta', theta);
    formula = formula.replace('sin', 'Math.sin');
    formula = formula.replace('cos', 'Math.cos');
    formula = formula.replace('tan', 'Math.tan');
    formula = formula.replace('sqrt', 'Math.sqrt');
    formula = formula.replace('abs', 'Math.abs');
    formula = formula.replace('log', 'Math.log');
    formula = formula.replace('exp', 'Math.exp');
    formula = formula.replace('pi', 'Math.PI');
    formula = formula.replace('e', 'Math.E');

    let r = eval(formula);
    return r;
}

const validateFormula = (formulaToValidate) => {
    console.log('Validating formula: ', formulaToValidate);
    if (!formulaToValidate || formulaToValidate.trim() === '') {
        console.log('Formula is empty');
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

        let allCharactersValid = formulaToValidate === '';
        calculateRadius(originalFormula, 5);
        let radiusValid = true;

        console.log(allCharactersValid, radiusValid);
        console.log(formulaToValidate);
        return allCharactersValid && radiusValid;
    } catch (error) {
        console.log('Error validating formula: ', error);
        return false;
    }
}

const ControlPanel = ({ formula, setFormula,
    isPanelOpen, setIsPanelOpen,
    size, setSize,
    speed, setSpeed }) => {
    const [editorFormula, setEditorFormula] = useState(formula);
    const handleEditorFormulaChange = (e) => {
        console.log('Formula changed to: ', e.target.value);
        setEditorFormula(e.target.value);
        console.log('Checking if formula is valid... ', e.target.value);
        if (validateFormula(e.target.value)) {
            console.log('Formula is valid, setting formula to: ', e.target.value);
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
                    max="10"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                />
                <label htmlFor="size-input">Speed: {speed}</label>
                <input
                    id="speed-input"
                    className="speed-input"
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                />
            </div>
        </div>
    );
}

export default ControlPanel;