var canvas = document.getElementById('graph');
var ctx2d = canvas.getContext('2d');
var scaleFactor = 0;
var factors;
var expansion;
function zoomin() {
    scaleFactor++;
    graphEquation();
}
function zoomout() {
    scaleFactor--;
    graphEquation();
}
function createGraph() {
    ctx2d.fillStyle = '#ffffff';
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.strokeStyle = '#000000';
    ctx2d.beginPath();
    ctx2d.moveTo(0, canvas.height / 2);
    ctx2d.lineTo(canvas.width, canvas.height / 2);
    ctx2d.moveTo(canvas.width / 2, 0);
    ctx2d.lineTo(canvas.width / 2, canvas.height);
    ctx2d.stroke();
    document.getElementById('scalefactor').textContent = "Scale Factor = 10^".concat(scaleFactor);
}
function generate() {
    generateFactors();
    generateExpansion();
    graphEquation();
    document.getElementById('equation').textContent = "".concat(factors, " = ").concat(expansion);
}
/***********************************************************************************
 * DEPENDING ON YOUR IMPLEMENTATION, YOU SHOULD NOT NEED TO WORK ABOVE THIS LINE
 ***********************************************************************************/
/**
 * GENERATE FACTORS FOR YOUR POLYNOMIAL
 */
function generateFactors() {
    factors = "";
}
/**
 * GENERATE THE EXPANSION OF YOUR POLYNOMIAL
 */
function generateExpansion() {
    expansion = "";
}
/**
 * GRAPH THE POLYNOMIAL
 */
function graphEquation() {
    createGraph();
    ctx2d.strokeStyle = '#00ff00';
    ctx2d.beginPath();
    /**
     * DRAW YOUR POLYNOMIAL HERE
     */
    ctx2d.stroke();
}
