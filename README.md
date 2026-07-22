# Grid Pathfinder

A small interactive visualizer for pathfinding algorithms on a grid. Draw walls, pick BFS or DFS, and watch the search explore the grid tile by tile before tracing out the final path.

## Features

- **Two algorithms** — switch between Breadth-First Search and (recursive) Depth-First Search from a dropdown
- **Wall drawing mode** — toggle "Add walls" and click tiles to mark them as obstacles the search can't cross
- **Animated search** — visited tiles and dead ends light up in real time as the algorithm runs
- **Path highlighting** — once the goal is found, the shortest/found path is traced across the grid
- **Clear button** — reset visited/dead-end/path styling without erasing your walls
- **Light / dark theme toggle** — persisted across visits via `localStorage`

## How it works

The grid is an 8x8 set of tiles. The top-left tile is the start (`.first`), the bottom-right tile is the goal (`.last`). Clicking **Start** runs the selected algorithm from the start tile:

- **BFS** (`bfs.js`) explores level by level using a queue, tracking each tile's predecessor so it can reconstruct the shortest path once it reaches the goal.
- **DFS** (`dfs.js`) explores recursively, marking tiles as visited or dead ends as it backtracks, and returns the first path it finds to the goal.

Both algorithms treat tiles with the `active` class (walls) as blocked and pause briefly (`sleep(10)` in `utils.js`) between steps so the search is visible instead of instant.

## Project structure

```
.
├── index.html          # markup, theme toggle script
├── style.css            # grid layout, tile states, light/dark theme variables
├── main.js               # grid setup, event wiring, wall mode, start/clear logic
├── utils.js              # shared sleep() helper for animation timing
└── algorithms/
    ├── bfs.js             # breadth-first search + path reconstruction
    └── dfs.js             # recursive depth-first search with backtracking
```

## Running it

This is a static site with no build step or dependencies. Just serve the folder and open it in a browser — for example:

```bash
npx serve .
# or
python3 -m http.server
```

Then visit the printed local URL.

## Usage

1. Click **Add walls**, then click tiles to mark them as obstacles. Click **Add walls** again to exit wall mode.
2. Pick **DFS** or **BFS** from the dropdown.
3. Click **Start** to run the search and watch it animate.
4. Click **Clear** to reset the visualization (walls stay in place).

## Ideas for future improvements

- Adjustable grid size and animation speed
- Draggable start/end tiles
- Additional algorithms (A*, Dijkstra, greedy best-first)
- Diagonal movement option
