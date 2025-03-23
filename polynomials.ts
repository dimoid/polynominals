let canvas: HTMLCanvasElement = document.getElementById('graph') as HTMLCanvasElement;
let ctx2d: CanvasRenderingContext2D = canvas.getContext('2d');

let scaleFactor: number = 0;

let factors: string;
let expansion: string;

function zoomin(): void {
    scaleFactor++;

    graphEquation();
}

function zoomout(): void {
    scaleFactor--;

    graphEquation();
}

function createGraph(): void {
    ctx2d.fillStyle = '#ffffff';
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    ctx2d.strokeStyle = '#000000';
    ctx2d.beginPath();
    ctx2d.moveTo(0, canvas.height / 2);
    ctx2d.lineTo(canvas.width, canvas.height / 2);

    ctx2d.moveTo(canvas.width / 2, 0);
    ctx2d.lineTo(canvas.width / 2, canvas.height);
    ctx2d.stroke();

    document.getElementById('scalefactor').textContent = `Scale Factor = 10^${scaleFactor}`;
}

function generate(): void {
    generateFactors();
    generateExpansion();
    graphEquation();

    document.getElementById('equation').textContent = `${factors} = ${expansion}`;
}

/***********************************************************************************
 * DEPENDING ON YOUR IMPLEMENTATION, YOU SHOULD NOT NEED TO WORK ABOVE THIS LINE
 ***********************************************************************************/


/**
 * GENERATE FACTORS FOR YOUR POLYNOMIAL
 */
function generateFactors(): void {
    factors = ``;
}

/**
 * GENERATE THE EXPANSION OF YOUR POLYNOMIAL
 */
function generateExpansion(): void {
    expansion = ``;
}

/**
 * GRAPH THE POLYNOMIAL
 */
function graphEquation(): void {
    createGraph();

    ctx2d.strokeStyle = '#00ff00';
    ctx2d.beginPath();

    /**
     * DRAW YOUR POLYNOMIAL HERE
     */

    ctx2d.stroke();
}

