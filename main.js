import { dfsRecursion } from './algorithms/dfs.js';
import { bfs } from './algorithms/bfs.js'

const grid = document.getElementById('grid');
const wallsBtn = document.getElementById('addWalls');
const startBtn = document.getElementById('start');
const selectAlgo = document.getElementById('algorithms');
const clearBtn = document.getElementById('clear');
const sizeInput = document.getElementById('sizeInput');
const resizeBtn = document.getElementById('resizeBtn');
const statusEl = document.getElementById('status');

let addingWalls = false;
let clearStage = 0;

let size = 8;
let children = [];
let rows = [];

// named handler so we can add/remove the SAME reference later
function toggleTileActive(e) {
    e.currentTarget.classList.toggle('active');
}

function setClearStage(stage) {
    clearStage = stage;
    clearBtn.textContent = stage === 0 ? 'Clear' : 'Clear walls';
}

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle('error', isError);
}

function setWallsMode(tiles, on) {
    tiles.forEach((tile) => {
        if (on) {
            tile.addEventListener('click', toggleTileActive);

        } else {
            tile.removeEventListener('click', toggleTileActive);
        }
    });
}

function buildGrid(newSize) {
    size = newSize;
    document.documentElement.style.setProperty('--size', size);

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++){
            const newTile = document.createElement("div");
            newTile.dataset.index = (i * size) + j;
            newTile.classList.add('tile');
            fragment.append(newTile);
        }
    }
    grid.append(fragment);

    const first = grid.firstElementChild;
    const last = grid.lastElementChild;

    first.classList.add('first');
    first.classList.remove('tile')
    last.classList.add('last');
    last.classList.remove('tile')

    children = [...grid.children];

    rows = [];
    for (let i = 0; i < children.length; i += size) {
        rows.push(children.slice(i, i + size));
    }

    children.forEach((child) => {
        child.addEventListener('click', () => {
            const value = Number(child.dataset.index);
            const row = Math.floor(value / size);
            const column = value % size;
            console.log("row: " + row);
            console.log("column: " + column);
        })
    })

    addingWalls = false;
    wallsBtn.classList.remove('active-mode');
    setClearStage(0);
    setStatus('');
}

buildGrid(size);

resizeBtn.addEventListener('click', () => {
    let newSize = parseInt(sizeInput.value, 10);
    if (Number.isNaN(newSize)) return;
    newSize = Math.min(25, Math.max(3, newSize));
    sizeInput.value = newSize;
    buildGrid(newSize);
});

clearBtn.addEventListener('click', () => {
    if (clearStage == 0) {
        children.forEach(tile => {
            tile.classList.remove('visited', 'deadend', 'path');
        });
        setClearStage(1);
    } else {
        children.forEach(tile => {
            tile.classList.remove('visited', 'deadend', 'path', 'active');
        });
        setClearStage(0);
    }
    setStatus('');
})

wallsBtn.addEventListener('click', () => {
    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });
    setClearStage(0);
    setStatus('');
    addingWalls = !addingWalls;
    wallsBtn.classList.toggle('active-mode', addingWalls); // glow the button while wall mode is on
    const tiles = [...document.getElementsByClassName('tile')];
    setWallsMode(tiles, addingWalls);
});

startBtn.addEventListener('click', async () => {
    const selectedAlgo = selectAlgo.value;

    if (addingWalls) {
        addingWalls = false;
        wallsBtn.classList.remove('active-mode');
        const tiles = [...document.getElementsByClassName('tile')];
        setWallsMode(tiles, addingWalls);
    }

    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });
    setClearStage(0);
    setStatus('');

    let path;

    if (selectedAlgo === 'dfs') {
        path = [];
        const success = await dfsRecursion(0, 0, rows, size, path);
        if (!success) path = null;
    } else if (selectedAlgo === 'bfs') {
        path = await bfs(0, 0, rows, size);
    }

    if (path) {
        path.forEach(([r, c]) => {
            rows[r][c].classList.add('path');
        });
        console.log('Path found:', path);
    } else {
        console.log('No path found');
        setStatus('No path exists — the end is blocked off.', true);
    }
});
