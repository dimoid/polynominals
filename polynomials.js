"use strict";
let canvas = document.getElementById('graph');
let ctx2d = canvas.getContext('2d');
let scaleFactor = 0;
let factors;
let expansion;
let delimiter = ' ';
function zoomin() {
    scaleFactor++;
    graphEquation();
}
function zoomout() {
    scaleFactor--;
    graphEquation();
}
function createGraph() {
    if (ctx2d) {
        ctx2d.fillStyle = '#ffffff';
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.strokeStyle = '#000000';
        ctx2d.beginPath();
        ctx2d.moveTo(0, canvas.height / 2);
        ctx2d.lineTo(canvas.width, canvas.height / 2);
        ctx2d.moveTo(canvas.width / 2, 0);
        ctx2d.lineTo(canvas.width / 2, canvas.height);
        ctx2d.stroke();
    }
    let scalefactor = document.getElementById('scalefactor');
    if (scalefactor) {
        scalefactor.textContent = `Scale Factor = 10^${scaleFactor}`;
    }
}
function generate() {
    generateFactors();
    generateExpansion();
    graphEquation();
    let equation = document.getElementById('equation');
    if (equation) {
        equation.textContent = `${factors} = ${expansion}`;
    }
}
/***********************************************************************************
 * DEPENDING ON YOUR IMPLEMENTATION, YOU SHOULD NOT NEED TO WORK ABOVE THIS LINE
 ***********************************************************************************/
/**
 * GENERATE FACTORS FOR YOUR POLYNOMIAL
 */
function generateFactors() {
    let numberOfFactors = Number(document.getElementById('factors')?.value) || 0;
    let allowCoefficients = document.querySelector('input[name="coefficients"]:checked')?.value === 'true';
    let min = Number(document.getElementById('min')?.value) || 0;
    let max = Number(document.getElementById('max')?.value) || 0;
    //validation
    if (numberOfFactors < 1) {
        throw new Error("Number of factors must be equal or greater then 1.");
    }
    if (!Number.isInteger(min)) {
        throw new Error("The minimum coefficient value must be whole number.");
    }
    if (!Number.isInteger(max)) {
        throw new Error("The maximum coefficient value must be whole number.");
    }
    if (min > max) {
        throw new Error("The maximum coefficient value must be greater than or equal to the minimum value.");
    }
    //generation
    const factorsArr = [];
    for (let i = 0; i < numberOfFactors; i++) {
        factorsArr.push(generateFactor(allowCoefficients, min, max));
    }
    factors = factorsArr.join('');
}
function generateFactor(allowCoefficients, min, max) {
    let coefficient = allowCoefficients ? generateRandomNumber(min, max) : 1;
    let constant = generateRandomNumber(min, max);
    let x = coefficient == 1 ? 'x' : coefficient == -1 ? '-x' : `${coefficient}x`;
    let operator = constant == 0 ? '' : constant > 0 ? `${delimiter}+${delimiter}` : `${delimiter}-${delimiter}`;
    return constant != 0 ? `(${x}${operator}${Math.abs(constant)})` : `(${x})`;
}
function generateRandomNumber(min, max) {
    let range = max - min + 1;
    let randomNumber = Math.random() * range;
    return Math.floor(randomNumber) + min;
}
/**
 * GENERATE THE EXPANSION OF YOUR POLYNOMIAL
 */
function generateExpansion() {
    const factorsArr = factors.match(/\(.+?\)/g) || [];
    const firstFactor = factorsArr.shift();
    if (firstFactor !== undefined) {
        let firstTerm = parsePolynomial(firstFactor.replaceAll(/\s+/g, ''));
        factorsArr.forEach((factor, index) => {
            const nextTerm = parsePolynomial(factor.replaceAll(/\s+/g, ''));
            firstTerm = multiplyPolynomials(firstTerm, nextTerm);
        });
        expansion = expandTerms(firstTerm);
    }
    else {
        expansion = ``;
    }
}
function parsePolynomial(factor) {
    const factorCleaned = factor.replace(/[()\s]/g, '');
    const terms = factorCleaned.split(/(?=[+-])/g); //split by the first met + or -
    return terms.map(term => parseTerm(term)).filter(term => term.coefficient != 0);
}
function parseTerm(term) {
    let coefficient = 0;
    let exponent = 0;
    if (term.includes('x')) {
        let parts = term.split('x');
        coefficient = parts[0] == '' || parts[0] == '+' ? 1 : (parts[0] == '-' ? -1 : Number(parts[0]));
        exponent = parts[1].includes('^') ? Number(parts[1].split('^')[1]) : 1;
    }
    else {
        coefficient = Number(term);
    }
    return { coefficient, exponent };
}
function multiplyPolynomials(firstTerms, secondTerms) {
    const expToCoeff = {};
    for (const firstTerm of firstTerms) {
        for (const secondTerm of secondTerms) {
            const resultCoefficient = firstTerm.coefficient * secondTerm.coefficient;
            const resultExponent = firstTerm.exponent + secondTerm.exponent;
            if (expToCoeff[resultExponent] !== undefined) {
                expToCoeff[resultExponent] += resultCoefficient;
            }
            else {
                expToCoeff[resultExponent] = resultCoefficient;
            }
        }
    }
    return Object.entries(expToCoeff)
        .map(([exponentStr, coefficient]) => ({
        coefficient: coefficient,
        exponent: Number(exponentStr)
    })).filter(term => term.coefficient != 0);
}
function expandTerms(terms) {
    terms.sort((a, b) => b.exponent - a.exponent);
    let expansion = '';
    terms.forEach((term, index) => {
        let operator = term.coefficient > 0 ? '+' : '-';
        const absCoefficient = Math.abs(term.coefficient);
        const exponent = term.exponent;
        let termStr = '';
        if (exponent == 0) {
            termStr = absCoefficient.toString(); //constant
        }
        else {
            if (absCoefficient != 1) {
                termStr += absCoefficient;
            }
            termStr += 'x';
            if (exponent != 1) {
                termStr += `^${exponent}`;
            }
        }
        if (index == 0) {
            expansion += term.coefficient < 0 ? `${operator}${termStr}` : termStr;
        }
        else {
            expansion += `${delimiter}${operator}${delimiter}${termStr}`;
        }
    });
    return expansion;
}
/**
 * GRAPH THE POLYNOMIAL
 */
function graphEquation() {
    createGraph();
    if (ctx2d) {
        ctx2d.strokeStyle = '#00ff00';
        ctx2d.beginPath();
        let zoom = Math.pow(10, scaleFactor);
        let step = 1 / zoom;
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let isInitialPoint = true;
        for (let x = -centerX / zoom; x < centerX / zoom; x += step) {
            let y = calculateY(x);
            let canvasX = centerX + x * zoom;
            let canvasY = centerY - y * zoom;
            if (isInitialPoint) {
                ctx2d.moveTo(canvasX, canvasY);
                isInitialPoint = false;
            }
            else {
                ctx2d.lineTo(canvasX, canvasY);
            }
        }
        ctx2d.stroke();
    }
}
let calculateY = (x) => {
    const terms = parsePolynomial(expansion);
    let y = 0;
    terms.forEach(term => {
        y += y + term.coefficient * Math.pow(x, term.exponent);
    });
    return y;
};
//# sourceMappingURL=polynomials.js.map