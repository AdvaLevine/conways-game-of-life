# Conway's Game of Life

An interactive implementation of Conway's Game of Life cellular automaton built with HTML, CSS, and JavaScript using the Model-View-Controller (MVC) architecture.

![Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

## Features

- Responsive grid with multiple size options (20x20, 40x40, 60x60)
- Adjustable simulation speed with pause functionality (0-10 scale)
- Several pre-built patterns including Glider, Blinker, Toad, Beacon, Pulsar, and Gosper Glider Gun
- Dark/light theme toggle
- Randomize grid with adjustable density
- Save and load simulation states
- Export and import patterns
- Animated cell transitions
- Keyboard shortcuts for common actions

## How to Use

1. Open `index.html` in your browser (Chrome recommended)
2. Use the controls to set grid size, speed, and patterns
3. Click 'Start' to begin the simulation or 'Stop' to pause it
4. Click individual cells to toggle them when the simulation is stopped
5. Use keyboard shortcuts for quick actions:
   - Space: Start/Stop
   - R: Randomize
   - C: Clear
   - Ctrl+S: Save
   - Ctrl+L: Load
   - +/-: Adjust Speed

## Rules of Conway's Game of Life

1. Any live cell with fewer than two live neighbors dies (underpopulation)
2. Any live cell with two or three live neighbors lives on to the next generation
3. Any live cell with more than three live neighbors dies (overpopulation)
4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction)

## Technical Details

- Built with vanilla JavaScript
- Implements the MVC (Model-View-Controller) design pattern
- Uses CSS Grid for responsive layout
- Optimized for Chrome browser
- Desktop focused experience 