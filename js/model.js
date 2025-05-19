/**
 * Game of Life - Model
 * Contains the core game logic and data structures
 */

class GameModel {
    constructor(size = 40) {
        this.size = size;
        this.grid = [];
        this.running = false;
        this.speed = 5;
        
        // Statistics tracking
        this.generation = 0;
        this.population = 0;
        this.birthCount = 0;
        this.deathCount = 0;
        
        this.initializeGrid();
        this.patterns = {
            glider: [
                [0, 0, 1],
                [1, 0, 1],
                [0, 1, 1]
            ],
            blinker: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            toad: [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            beacon: [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 1, 1],
                [0, 0, 1, 1]
            ],
            pulsar: [
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
            ],
            gosperGliderGun: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };
    }

    // Initialize an empty grid
    initializeGrid() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            const row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(0);
            }
            this.grid.push(row);
        }
        
        // Reset statistics
        this.generation = 0;
        this.population = 0;
        this.birthCount = 0;
        this.deathCount = 0;
    }

    // Resize the grid
    resizeGrid(newSize) {
        // Save old size for reference
        const oldSize = this.size;
        
        // Update size and reset the grid
        this.size = newSize;
        this.initializeGrid();
        
        
        return oldSize; 
    }

    // Set a cell state (0 = dead, 1 = alive)
    setCell(row, col, state) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            // Update population count if the cell state changes
            if (this.grid[row][col] !== state) {
                this.population += state === 1 ? 1 : -1;
            }
            this.grid[row][col] = state;
        }
    }

    // Toggle a cell state
    toggleCell(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            this.grid[row][col] = this.grid[row][col] ? 0 : 1;
            // Update population count
            this.population += this.grid[row][col] ? 1 : -1;
        }
    }

    // Count live neighbors for a cell
    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const r = (row + i + this.size) % this.size;
                const c = (col + j + this.size) % this.size;
                
                count += this.grid[r][c];
            }
        }
        return count;
    }

    // Apply Game of Life rules to calculate the next generation
    nextGeneration() {
        const newGrid = [];
        let births = 0;
        let deaths = 0;
        let hasLivingCells = false;
        
        for (let i = 0; i < this.size; i++) {
            const newRow = [];
            for (let j = 0; j < this.size; j++) {
                const neighbors = this.countNeighbors(i, j);
                const cellState = this.grid[i][j];
                let newState;
                
                // Apply Conway's Game of Life rules
                if (cellState === 1 && (neighbors < 2 || neighbors > 3)) {
                    // Cell dies from under/over population
                    newState = 0;
                    deaths++;
                } else if (cellState === 0 && neighbors === 3) {
                    // Cell becomes alive by reproduction
                    newState = 1;
                    births++;
                    hasLivingCells = true;
                } else {
                    // Cell stays in current state
                    newState = cellState;
                    if (cellState === 1) {
                        hasLivingCells = true;
                    }
                }
                
                newRow.push(newState);
            }
            newGrid.push(newRow);
        }
        
        this.grid = newGrid;
        
        // Only update statistics if there are living cells
        if (hasLivingCells) {
            this.generation++;
            this.birthCount += births;
            this.deathCount += deaths;
            this.updatePopulation();
            return true; // Grid has living cells
        }
        
        return false; // Grid has no living cells
    }

    // Get current statistics
    getStatistics() {
        return {
            generation: this.generation,
            population: this.population,
            birthCount: this.birthCount,
            deathCount: this.deathCount,
            birthRate: this.generation > 0 ? (this.birthCount / this.generation).toFixed(2) : 0,
            deathRate: this.generation > 0 ? (this.deathCount / this.generation).toFixed(2) : 0
        };
    }

    // Update the population count by scanning the grid
    updatePopulation() {
        this.population = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.population += this.grid[i][j];
            }
        }
    }

    // Randomize the grid with a specified density (percentage of live cells)
    randomize(density = 0.3) {
        let births = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const newState = Math.random() < density ? 1 : 0;
                if (newState === 1) births++;
                this.grid[i][j] = newState;
            }
        }
        
        // Reset statistics
        this.generation = 0;
        this.population = births;
        this.birthCount = 0;
        this.deathCount = 0;
    }

    // Clear the grid
    clear() {
        this.initializeGrid();
    }

    // Apply a predefined pattern to the grid
    applyPattern(patternName) {
        // Clear the grid first
        this.clear();
        
        const pattern = this.patterns[patternName];
        if (!pattern) return;
        
        // For larger grid sizes, scale up the pattern
        let scaledPattern = this.scalePatternToFit(pattern);
        
        // Calculate center position to place the pattern
        const centerRow = Math.floor(this.size / 2) - Math.floor(scaledPattern.length / 2);
        const centerCol = Math.floor(this.size / 2) - Math.floor(scaledPattern[0].length / 2);
        
        // Apply the pattern to the grid
        let births = 0;
        for (let i = 0; i < scaledPattern.length; i++) {
            for (let j = 0; j < scaledPattern[i].length; j++) {
                if (scaledPattern[i][j] === 1) births++;
                this.setCell(centerRow + i, centerCol + j, scaledPattern[i][j]);
            }
        }
        
        this.population = births;
    }

    // Scale a pattern to fit the current grid size
    scalePatternToFit(pattern) {
        // Don't scale for small grid sizes
        if (this.size <= 40) {
            return pattern;
        }
        
        // At this point, we know size is 60x60 since that's our maximum
        const patternRows = pattern.length;
        const patternCols = pattern[0].length;
        
        // Special handling for oscillators and other patterns
        // Comparing with known patterns by size and shape
        const isToad = (patternRows === 4 && patternCols === 4);
        const isBlinker = (patternRows === 3 && patternCols === 3 && pattern[0][1] === 1 && pattern[1][1] === 1 && pattern[2][1] === 1);
        const isBeacon = (patternRows === 4 && patternCols === 4 && pattern[0][0] === 1 && pattern[1][1] === 1);
        const isPulsar = (patternRows === 13 && patternCols === 13); // Pulsar is 13x13
        const isGlider = (patternRows === 3 && patternCols === 3 && pattern[0][2] === 1 && pattern[1][0] === 1);
        
        // For 60x60, handle pattern placement and scaling
        if (isToad || isBlinker || isBeacon || isPulsar || !isGlider) {
            // Calculate spacing and number of copies based on pattern
            const isLargePattern = (patternRows > 10 || patternCols > 10);
            const spacing = isLargePattern ? 15 : 6; // Larger spacing for large patterns
            
            // Determine number of copies based on pattern size
            const numCopies = isLargePattern ? 1 : 2; // 1 copy for large patterns, 2x2 for small patterns
            
            // For very large patterns on 60x60, just use the pattern as is
            if (isLargePattern) {
                return pattern;
            }
            
            // Calculate the total size needed for the arrangement
            const totalRows = patternRows * numCopies + spacing * (numCopies - 1);
            const totalCols = patternCols * numCopies + spacing * (numCopies - 1);
            
            // Create a new pattern with multiple copies arranged with spacing
            const arrangedPattern = Array(totalRows).fill().map(() => Array(totalCols).fill(0));
            
            // Place copies of the original pattern
            for (let copyRow = 0; copyRow < numCopies; copyRow++) {
                for (let copyCol = 0; copyCol < numCopies; copyCol++) {
                    // Calculate starting position for this copy
                    const startRow = copyRow * (patternRows + spacing);
                    const startCol = copyCol * (patternCols + spacing);
                    
                    // Copy the pattern
                    for (let i = 0; i < patternRows; i++) {
                        for (let j = 0; j < patternCols; j++) {
                            arrangedPattern[startRow + i][startCol + j] = pattern[i][j];
                        }
                    }
                }
            }
            
            return arrangedPattern;
        }
        
        // For glider and other patterns on 60x60, use standard scaling
        const scaleFactor = 2;
        
        // Use integer scaling for glider pattern
        const scaledRows = patternRows * scaleFactor;
        const scaledCols = patternCols * scaleFactor;
        const scaledPattern = Array(scaledRows).fill().map(() => Array(scaledCols).fill(0));
        
        for (let i = 0; i < patternRows; i++) {
            for (let j = 0; j < patternCols; j++) {
                if (pattern[i][j] === 1) {
                    // Create a block of size scaleFactor×scaleFactor
                    for (let si = 0; si < scaleFactor; si++) {
                        for (let sj = 0; sj < scaleFactor; sj++) {
                            scaledPattern[i*scaleFactor + si][j*scaleFactor + sj] = 1;
                        }
                    }
                }
            }
        }
        
        return scaledPattern;
    }

    // Get a list of available patterns
    getPatterns() {
        return Object.keys(this.patterns);
    }

    // Save the current state
    saveState() {
        try {
            const state = {
                grid: this.grid,
                size: this.size,
                generation: this.generation,
                population: this.population,
                birthCount: this.birthCount,
                deathCount: this.deathCount
            };
            localStorage.setItem('gameOfLifeState', JSON.stringify(state));
            return true;
        } catch (e) {
            console.error('Failed to save game state:', e);
            return false;
        }
    }

    // Load a saved state
    loadState() {
        try {
            const savedState = localStorage.getItem('gameOfLifeState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.grid = state.grid;
                this.size = state.size;
                this.generation = state.generation || 0;
                this.population = state.population || 0;
                this.birthCount = state.birthCount || 0;
                this.deathCount = state.deathCount || 0;
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to load game state:', e);
            return false;
        }
    }

    // Export the current pattern as a string
    exportPattern() {
        let minRow = this.size, maxRow = 0, minCol = this.size, maxCol = 0;
        let hasLiveCells = false;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 1) {
                    minRow = Math.min(minRow, i);
                    maxRow = Math.max(maxRow, i);
                    minCol = Math.min(minCol, j);
                    maxCol = Math.max(maxCol, j);
                    hasLiveCells = true;
                }
            }
        }

        if (!hasLiveCells) return '';

        let pattern = [];
        for (let i = minRow; i <= maxRow; i++) {
            let row = [];
            for (let j = minCol; j <= maxCol; j++) {
                row.push(this.grid[i][j]);
            }
            pattern.push(row);
        }

        return JSON.stringify(pattern);
    }

    importPattern(patternStr) {
        try {
            const pattern = JSON.parse(patternStr);
            if (!Array.isArray(pattern) || pattern.length === 0 || !Array.isArray(pattern[0])) {
                throw new Error('Invalid pattern format');
            }

            this.clear();

            // Calculate center position to place the pattern
            const centerRow = Math.floor(this.size / 2) - Math.floor(pattern.length / 2);
            const centerCol = Math.floor(this.size / 2) - Math.floor(pattern[0].length / 2);

            // Apply the pattern to the grid
            let births = 0;
            for (let i = 0; i < pattern.length; i++) {
                for (let j = 0; j < pattern[i].length; j++) {
                    const state = pattern[i][j] === 1 ? 1 : 0;
                    if (state === 1) births++;
                    this.setCell(centerRow + i, centerCol + j, state);
                }
            }

            this.population = births;
            return true;
        } catch (e) {
            console.error('Failed to import pattern:', e);
            return false;
        }
    }

    // Check if the grid has any living cells
    hasLivingCells() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
} 