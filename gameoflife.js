// Canvas Variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.shadowBlur = 0; ctx.shadowOffsetX = -3; ctx.shadowOffsetY = 3; ctx.shadowColor = '#A03C00';
// Cavnas Configs
const resolution = 10;
const COLS = Math.round(canvas.width / resolution);
const ROWS = Math.round(canvas.height / resolution);
// Cell Class
class Cell {
    constructor() {
        this.currentState = 0;
    }
}
// Build Grid Mehtod
function buildGrid() {
    return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(null).map(() => new Cell));
}   
// Render Mehtod
function render(grid) {
    // Cell Iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = grid.length-1; col > -1 ; col--)
        for (let row = 0; row < grid[col].length-1; row++) {
            const cell = grid[col][row];
            if (!cell.currentState) continue;
                ctx.beginPath();
                ctx.rect(col * resolution, row * resolution, resolution, resolution);
                ctx.fill();
        }
}
// Get Next Gen Grid Mehtod
function nextGen(grid) {
    // let targetGrid = grid.map(arr => [...arr]);
    const currentGen = grid.map(arr => arr.map(cell => cell.currentState))
    // Cell Iteration
    for (let col = 0; col < currentGen.length; col++) {
        for (let row = 0; row < currentGen[0].length; row++) {
            const cell = currentGen[col][row];
            // Neighbour Counting
            let nN = 0;
            for (let i=-1; i<2; i++)
                for (let j=-1; j<2; j++) {
                    if (i===0 && j===0) continue;
                    const targetCol=col+i;
                    const targetRow=row+j;
                    if (targetCol<0 || targetCol>=COLS || targetRow<0 || targetRow>=ROWS) continue;
                    nN += currentGen[targetCol][targetRow] ;
                }
            // Game Rules
            if (cell===1) { 
                if(nN < 2 || nN > 3) grid[col][row].currentState = 0;
                else grid[col][row].total++;
            }
            else if (nN===3) grid[col][row].currentState = 1;
        }
    }
    return grid;
}
// Create the Grid
let grid = buildGrid();
// Use GosperGliderGun
// const gliderGun = [[0,4],[1,4],[0,5],[1,5],[10,4],[10,5],[10,6],[11,3],[11,7],[12,2],[12,8],[13,2],[13,8],[14,5],[15,3],[15,7],[16,4],[16,5],[16,6],[17,5],[20,4],[20,3],[20,2],[21,4],[21,3],[21,2],[22,1],[22,5],[24,0],[24,1],[24,5],[24,6],[34,2],[35,2],[34,3],[35,3]]; 
const warmedUpGun = [[0,84],[0,85],[1,84],[1,85],[8,84],[9,83],[9,84],[9,85],[10,82],[10,83],[10,84],[10,85],[10,86],[11,81],[11,83],[11,85],[11,87],[12,81],[12,82],[12,86],[12,87],[15,84],[16,83],[16,85],[17,83],[17,85],[17,86],[18,84],[18,85],[18,86],[19,84],[19,87],[20,85],[20,86],[20,87],[21,84],[21,88],[22,83],[22,89],[23,78],[23,84],[23,88],[24,77],[24,85],[24,86],[24,87],[25,77],[25,78],[25,79],[31,70],[32,70],[32,72],[33,70],[33,71],[34,86],[34,87],[35,86],[35,87],[38,63],[39,62],[40,62],[40,63],[40,64],[46,55],[47,55],[47,57],[48,55],[48,56],[53,48],[54,47],[55,47],[55,48],[55,49],[61,40],[62,40],[62,42],[63,40],[63,41],[68,33],[69,32],[70,32],[70,33],[70,34],[76,25],[77,25],[77,27],[78,25],[78,26],[83,18],[84,17],[85,17],[85,18],[85,19],[91,10],[92,10],[92,12],[93,10],[93,11],[98,3],[99,2],[100,2],[100,3],[100,4]];
//const amogus = [[18,12],[18,13],[18,14],[18,15],[18,16],[19,11],[19,17],[20,11],[20,18],[21,9],[21,10],[21,11],[21,12],[21,13],[21,14],[21,15],[21,16],[21,17],[21,18],[21,19],[21,20],[21,21],[22,8],[22,22],[22,89],[23,7],[23,22],[23,89],[24,7],[24,22],[25,7],[25,11],[25,12],[25,13],[25,19],[25,20],[25,21],[26,7],[26,10],[26,14],[26,18],[27,7],[27,10],[27,14],[27,18],[28,7],[28,10],[28,14],[28,18],[28,19],[28,20],[29,7],[29,10],[29,14],[29,18],[29,21],[30,7],[30,10],[30,14],[30,21],[31,8],[31,10],[31,14],[31,21],[32,9],[32,10],[32,14],[32,15],[32,16],[32,17],[32,18],[32,19],[32,20],[33,11],[33,12],[33,13]];
for ([c,r] of warmedUpGun)
    grid[c][r].currentState = 1;
// Animation Variables and Methods
var isPaused = false, cancelID, timeCancelID, unpauseTimer;
function step() {
    render((grid = nextGen(grid)));
}
function update() {
    timeCancelID = setTimeout(() => {
        step();
        cancelID = requestAnimationFrame(update);
    }, 75)
}
function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) 
        cancelID = requestAnimationFrame(update);
    else {
        cancelAnimationFrame(cancelID);
        clearTimeout(timeCancelID);
    }
}
// Animate
cancelID = requestAnimationFrame(update);
// Clicks Handler and Listener
const toggleCell = ({clientX, clientY}) => {
    if (!isPaused) togglePause(); 
    let rect = canvas.getBoundingClientRect();
    const [x,y] = [Math.floor((clientX - rect.left)*108/canvas.clientWidth), Math.floor((clientY - rect.top)*90/canvas.clientHeight)];
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;
    grid[x][y].currentState = (grid[x][y].currentState + 1)%2;
    render(grid);
}
canvas.addEventListener('mousedown', toggleCell);
// Keys Handler
window.onkeydown = (e) => {
    switch (e.keyCode) {
        case 32:
            e.preventDefault();
            togglePause();
            break;
        case 16:
            step();
            break;
    }
}
