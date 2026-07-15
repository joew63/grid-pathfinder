import { dfsRecursion } from './algorithms/dfs.js';
import { bfs } from './algorithms/bfs.js'

const grid = document.getElementById('grid');
const fragment = document.createDocumentFragment();
const wallsBtn = document.getElementById('addWalls');
const startBtn = document.getElementById('start');
const selectAlgo = document.getElementById('algorithms');
const clearBtn = document.getElementById('clear');

let addingWalls = false;

let size = 7;

document.documentElement.style.setProperty('--size', size);

for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++){
        const newTile = document.createElement("div");
        // newTile.textContent = `${(i * size) + j}`;
        newTile.dataset.index = (i * size) + j;
        newTile.classList.add('tile');
        fragment.append(newTile);
    }
}
grid.append(fragment);

const first = document.getElementById('grid').firstElementChild;
const last = document.getElementById('grid').lastElementChild;

first.classList.add('first');
first.classList.remove('tile')
last.classList.add('last');
last.classList.remove('tile')

const children = [...grid.children];
// console.log(children);

const rows = [];
for (let i = 0; i < children.length; i += size) {
    rows.push(children.slice(i, i + size));
}
console.log(rows)

children.forEach((child) => {
    child.addEventListener('click', () => {
        // console.log(child.innerHTML);
        const value = Number(child.dataset.index);
        const row = Math.floor(value/ size);
        const column = value % size;
        console.log("row: " + row);
        console.log("column: " + column);
    })
})


// named handler so we can add/remove the SAME reference later
function toggleTileActive(e) {
    e.currentTarget.classList.toggle('active');
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

clearBtn.addEventListener('click', () => {
    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });
})

wallsBtn.addEventListener('click', () => {
    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });
    addingWalls = !addingWalls;
    wallsBtn.classList.toggle('active-mode', addingWalls); // glow the button while wall mode is on
    const tiles = [...document.getElementsByClassName('tile')];
    setWallsMode(tiles, addingWalls);
});

startBtn.addEventListener('click', async () => {
    const selectedAlgo = selectAlgo.value;

    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });

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
    }
});
