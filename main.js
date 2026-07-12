const grid = document.getElementById('grid');
const fragment = document.createDocumentFragment();
const wallsBtn = document.getElementById('addWalls');
const startBtn = document.getElementById('start');

let addingWalls = false;

let size = 7;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    children.forEach(tile => {
        tile.classList.remove('visited', 'deadend', 'path');
    });
    path.length = 0;

    const success = await recursiveTile(0, 0);

    if (success) {
        path.forEach(([r, c]) => {
            rows[r][c].classList.add('path');
        });
        console.log('Path found:', path);
    } else {
        console.log('No path found');
    }
});

const path = [];

async function recursiveTile(row, column) {
    if (
        row >= size || row < 0 ||
        column < 0 || column >= size ||
        rows[row][column].classList.contains('active') ||
        rows[row][column].classList.contains('visited')
    ) {
        return false;
    }

    rows[row][column].classList.add('visited');
    path.push([row, column]);
    await sleep(50); // pause so you can see this tile light up

    if (rows[row][column].classList.contains('last')) {
        return true;
    }

    const found =
        (await recursiveTile(row - 1, column)) ||
        (await recursiveTile(row, column - 1)) ||
        (await recursiveTile(row, column + 1)) ||
        (await recursiveTile(row + 1, column));

    if (!found) {
        path.pop();
        rows[row][column].classList.remove('visited');
        rows[row][column].classList.add('deadend');
        await sleep(100); // pause so you can see the backtrack too
    }

    return found;
}