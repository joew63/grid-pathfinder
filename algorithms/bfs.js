import { sleep } from '../utils.js';

export async function bfs(startRow, startCol, rows, size) {
    const queue = [[startRow, startCol]];
    const visited = new Set();
    visited.add(`${startRow},${startCol}`);

    const cameFrom = new Map();

    while (queue.length > 0) {
        const [row, column] = queue.shift();

        if (rows[row][column].classList.contains('last')) {
            const path = reconstructPath(cameFrom, row, column);
            return path; // success — return it
        }

        rows[row][column].classList.add('visited');
        await sleep(10);

        if (
            row + 1 < size &&
            !rows[row + 1][column].classList.contains('active') &&
            !visited.has(`${row + 1},${column}`)
        ) {
            visited.add(`${row + 1},${column}`);
            cameFrom.set(`${row + 1},${column}`, [row, column]);
            queue.push([row + 1, column]);
        }
        if (
            column + 1 < size &&
            !rows[row][column + 1].classList.contains('active') &&
            !visited.has(`${row},${column + 1}`)
        ) {
            visited.add(`${row},${column + 1}`);
            cameFrom.set(`${row},${column + 1}`, [row, column]);
            queue.push([row, column + 1]);
        }
        if (
            row - 1 >= 0 &&
            !rows[row - 1][column].classList.contains('active') &&
            !visited.has(`${row - 1},${column}`)
        ) {
            visited.add(`${row - 1},${column}`);
            cameFrom.set(`${row - 1},${column}`, [row, column]);
            queue.push([row - 1, column]);
        }
        if (
            column - 1 >= 0 &&
            !rows[row][column - 1].classList.contains('active') &&
            !visited.has(`${row},${column - 1}`)
        ) {
            visited.add(`${row},${column - 1}`);
            cameFrom.set(`${row},${column - 1}`, [row, column]);
            queue.push([row, column - 1]);
        }
    }

    return null; // queue emptied, no path found
}

function reconstructPath(cameFrom, endRow, endCol) {
    const path = [[endRow, endCol]];
    let currentKey = `${endRow},${endCol}`;

    while (cameFrom.has(currentKey)) {
        let [row, column] = cameFrom.get(currentKey);
        path.push([row, column]);
        currentKey = `${row},${column}`;
    }

    return path.reverse();
}