import { sleep } from '../utils.js';

export async function recursiveTile(row, column, rows, size, path) {
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
    await sleep(10); // pause so you can see this tile light up

    if (rows[row][column].classList.contains('last')) {
        return true;
    }

    const found =
        (await recursiveTile(row - 1, column, rows, size, path)) ||
        (await recursiveTile(row, column - 1, rows, size, path)) ||
        (await recursiveTile(row, column + 1, rows, size, path)) ||
        (await recursiveTile(row + 1, column, rows, size, path));

    if (!found) {
        path.pop();
        rows[row][column].classList.remove('visited');
        rows[row][column].classList.add('deadend');
        await sleep(10); // pause so you can see the backtrack too
    }

    return found;
}