let canvas: HTMLCanvasElement = document.getElementById('graph') as HTMLCanvasElement;
let ctx2d: CanvasRenderingContext2D | null = canvas.getContext('2d');

let scaleFactor: number = 0;

let factors: string;
let expansion: string;

type Term = {
    coefficient: number;
    exponent: number;
}

type TermExpToCoeff = {
    [key: number]: number;
}

let delimiter: string = ' ';

function zoomin(): void {
    scaleFactor++;

    graphEquation();
}

function zoomout(): void {
    scaleFactor--;

    graphEquation();
}

function createGraph(): void {
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

    let scalefactor: HTMLLabelElement | null = document.getElementById('scalefactor') as HTMLLabelElement | null;
    if (scalefactor) {
        scalefactor.textContent = `Scale Factor = 10^${scaleFactor}`;
    } 
}

function generate(): void {
    generateFactors();
    generateExpansion();
    graphEquation();

    let equation: HTMLLabelElement | null = document.getElementById('equation') as HTMLLabelElement | null;
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
function generateFactors(): void {
    let numberOfFactors: number = Number((document.getElementById('factors') as HTMLInputElement)?.value) || 0;
    let allowCoefficients: boolean = (document.querySelector('input[name="coefficients"]:checked') as HTMLInputElement)?.value === 'true';
    let min: number = Number((document.getElementById('min') as HTMLInputElement)?.value) || 0;
    let max: number =  Number((document.getElementById('max') as HTMLInputElement)?.value) || 0;

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
    const factorsArr: string[] = [];
    for (let i = 0; i < numberOfFactors; i++) {
        factorsArr.push(generateFactor(allowCoefficients, min, max));
    }

    factors = factorsArr.join('');
}

function generateFactor(allowCoefficients: boolean, min: number, max: number): string {
    let coefficient = allowCoefficients ? generateRandomNumber(min, max) : 1;
    let constant = generateRandomNumber(min, max);

    let x: string = coefficient == 1 ? 'x' : coefficient == -1 ? '-x' : `${coefficient}x`;
    let operator: string = constant == 0 ? '' : constant > 0 ? `${delimiter}+${delimiter}` : `${delimiter}-${delimiter}`;

    return constant != 0 ? `(${x}${operator}${Math.abs(constant)})` : `(${x})`;
}

function generateRandomNumber(min: number, max: number): number {
    let range = max - min + 1;
    let randomNumber = Math.random() * range;
    return Math.floor(randomNumber) + min;
}

/**
 * GENERATE THE EXPANSION OF YOUR POLYNOMIAL
 */
function generateExpansion(): void {
    const factorsArr: string[] = factors.match(/\(.+?\)/g) || [];

    const firstFactor: string | undefined = factorsArr.shift();
    if (firstFactor !== undefined) {
        let firstTerm: Term[] = parsePolynomial(firstFactor.replaceAll(/\s+/g, ''));
        factorsArr.forEach((factor, index) => {
            const nextTerm = parsePolynomial(factor.replaceAll(/\s+/g, ''));
            firstTerm = multiplyPolynomials(firstTerm, nextTerm);
        });
        expansion = expandTerms(firstTerm);
    } else {
        expansion = ``;
    }
}

function parsePolynomial(factor: string): Term[] {
    const factorCleaned = factor.replace(/[()\s]/g, '');
    const terms = factorCleaned.split(/(?=[+-])/g); //split by the first met + or -
    return terms.map(term => parseTerm(term)).filter(term => term.coefficient != 0);
}

function parseTerm(term: string): Term {
    let coefficient: number = 0; 
    let exponent: number = 0;
    
    if (term.includes('x')) {
        let parts = term.split('x');
        coefficient = parts[0] == '' || parts[0] == '+' ? 1 : (parts[0] == '-' ? -1 : Number(parts[0]));
        exponent = parts[1].includes('^') ? Number(parts[1].split('^')[1]) : 1;
    } else {
        coefficient = Number(term);
    }

    return {coefficient, exponent};
}

function multiplyPolynomials(firstTerms: Term[], secondTerms: Term[]): Term[] {
    const expToCoeff: TermExpToCoeff = {};

    for (const firstTerm of firstTerms) {
        for (const secondTerm of secondTerms) {
            const resultCoefficient = firstTerm.coefficient * secondTerm.coefficient;
            const resultExponent = firstTerm.exponent + secondTerm.exponent;

            if (expToCoeff[resultExponent] !== undefined) {
                expToCoeff[resultExponent] += resultCoefficient;
            } else {
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

function expandTerms(terms: Term[]): string {
    terms.sort((a, b) => b.exponent - a.exponent);
    let expansion = '';

    terms.forEach((term, index) => {
        let operator: string = term.coefficient > 0 ? '+' : '-';

        const absCoefficient = Math.abs(term.coefficient);
        const exponent = term.exponent;

        let termStr = '';
        if (exponent == 0) {
            termStr = absCoefficient.toString(); //constant
        } else {
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
        } else {
            expansion += `${delimiter}${operator}${delimiter}${termStr}`;
        }
    });

    return expansion;
}

/**
 * GRAPH THE POLYNOMIAL
 */
function graphEquation(): void {
    createGraph();

    if (ctx2d) {
        ctx2d.strokeStyle = '#00ff00';
        ctx2d.beginPath();
    
        let zoom = Math.pow(10, scaleFactor);
        let step = 1 / zoom;
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        let isInitialPoint: boolean = true;
        for (let x = -centerX / zoom; x < centerX / zoom; x += step) {
            let y = calculateY(x);
            let canvasX = centerX + x * zoom;
            let canvasY = centerY - y * zoom;
            if (isInitialPoint) {
                ctx2d.moveTo(canvasX, canvasY);
                isInitialPoint = false;
            } else {
                ctx2d.lineTo(canvasX, canvasY);
            }
        }
    
        ctx2d.stroke();
    }
}

let calculateY = (x: number): number => {
    const terms: Term[] = parsePolynomial(expansion);
    let y = 0;
    terms.forEach(term => {
        y += y + term.coefficient*Math.pow(x, term.exponent);
    })

    return y;
};