/**
 * Game of Life - Controller
 * Handles the user interactions and connects the model and view
 */

class GameController {
    constructor() {
        // Initialize model and view
        this.model = new GameModel();
        this.view = new GameView(this.model);
        
        // Game loop variables
        this.intervalId = null;
        this.intervalSpeed = 200;
        this.useAnimationFrame = true; 
        
        // Initialize the view
        this.view.initializeGrid();
        this.view.updatePatternSelector();
        
        // Apply initial pattern
        this.model.applyPattern('glider');
        this.view.updateGrid();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Add advanced UI elements
        this.addAdvancedControls();
        
        // Handle window resize events
        window.addEventListener('resize', () => this.view.handleResize());
    }

    // Set up all UI event listeners
    setupEventListeners() {
        const startStopButton = document.getElementById('start-stop');
        startStopButton.addEventListener('click', () => this.toggleRunning());
        
        const clearButton = document.getElementById('clear');
        clearButton.addEventListener('click', () => this.clearGrid());
        
        const randomButton = document.getElementById('random');
        randomButton.addEventListener('click', () => this.randomizeGrid());
        
        const gridSizeSelect = document.getElementById('grid-size');
        gridSizeSelect.addEventListener('change', () => this.changeGridSize(parseInt(gridSizeSelect.value)));
        
        const speedInput = document.getElementById('speed');
        speedInput.addEventListener('input', () => this.changeSpeed(speedInput.value));
        
        const patternSelect = document.getElementById('patterns');
        const applyPatternButton = document.getElementById('apply-pattern');
        applyPatternButton.addEventListener('click', () => this.applyPattern(patternSelect.value));
        
        this.view.gridContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !this.model.running) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.toggleCell(row, col);
            }
        });
        
        const saveButton = document.getElementById('save');
        saveButton.addEventListener('click', () => this.saveState());
        
        const loadButton = document.getElementById('load');
        loadButton.addEventListener('click', () => this.loadState());
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('dark-theme', themeToggle.checked);
            });
            
            if (localStorage.getItem('dark-theme') === 'true') {
                themeToggle.checked = true;
                document.body.classList.add('dark-theme');
            }
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space bar: toggle simulation
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleRunning();
            }
            
            // R key: randomize
            if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.randomizeGrid();
            }
            
            // C key: clear
            if (e.code === 'KeyC' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.clearGrid();
            }
            
            // S key: save
            if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.saveState();
            }
            
            // L key: load
            if (e.code === 'KeyL' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.loadState();
            }
            
            // Plus/minus: adjust speed
            if (e.code === 'Equal' || e.code === 'NumpadAdd') {
                e.preventDefault();
                const currentSpeed = parseInt(speedInput.value);
                if (currentSpeed < 10) {
                    speedInput.value = currentSpeed + 1;
                    this.changeSpeed(speedInput.value);
                }
            }
            
            if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
                e.preventDefault();
                const currentSpeed = parseInt(speedInput.value);
                if (currentSpeed > 0) {
                    speedInput.value = currentSpeed - 1;
                    this.changeSpeed(speedInput.value);
                }
            }
        });
        
    }

    // Add advanced UI controls
    addAdvancedControls() {
        const advancedControls = document.createElement('div');
        advancedControls.className = 'advanced-controls';
        
        const title = document.createElement('h3');
        title.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced Controls';
        advancedControls.appendChild(title);
        
        const patternControls = document.createElement('div');
        patternControls.className = 'control-group pattern-controls';
        
        const exportButton = document.createElement('button');
        exportButton.id = 'export-pattern';
        exportButton.innerHTML = '<i class="fas fa-file-export"></i> Export Pattern';
        
        const importButton = document.createElement('button');
        importButton.id = 'import-pattern';
        importButton.innerHTML = '<i class="fas fa-file-import"></i> Import Pattern';
        
        patternControls.appendChild(exportButton);
        patternControls.appendChild(importButton);
        advancedControls.appendChild(patternControls);
        
        const randomControls = document.createElement('div');
        randomControls.className = 'control-group random-controls';
        
        const densityLabel = document.createElement('label');
        densityLabel.htmlFor = 'density';
        densityLabel.innerHTML = '<i class="fas fa-random"></i> Random Density:';
        
        const densitySlider = document.createElement('input');
        densitySlider.type = 'range';
        densitySlider.id = 'density';
        densitySlider.min = '10';
        densitySlider.max = '90';
        densitySlider.value = '30';
        
        const densityValue = document.createElement('span');
        densityValue.id = 'density-value';
        densityValue.textContent = '30%';
        
        const applyDensityButton = document.createElement('button');
        applyDensityButton.id = 'apply-density';
        applyDensityButton.innerHTML = '<i class="fas fa-check"></i> Apply';
        
        randomControls.appendChild(densityLabel);
        randomControls.appendChild(densitySlider);
        randomControls.appendChild(densityValue);
        randomControls.appendChild(applyDensityButton);
        advancedControls.appendChild(randomControls);
        
        const renderingControls = document.createElement('div');
        renderingControls.className = 'control-group rendering-controls';
        
        const renderModeLabel = document.createElement('label');
        renderModeLabel.htmlFor = 'rendering-mode';
        renderModeLabel.innerHTML = '<i class="fas fa-paint-brush"></i> Smooth Rendering:';
        
        const renderModeToggle = document.createElement('label');
        renderModeToggle.className = 'switch';
        
        const renderModeInput = document.createElement('input');
        renderModeInput.type = 'checkbox';
        renderModeInput.id = 'rendering-mode';
        renderModeInput.checked = this.useAnimationFrame;
        
        const renderModeSlider = document.createElement('span');
        renderModeSlider.className = 'slider';
        
        renderModeToggle.appendChild(renderModeInput);
        renderModeToggle.appendChild(renderModeSlider);
        
        renderingControls.appendChild(renderModeLabel);
        renderingControls.appendChild(renderModeToggle);
        advancedControls.appendChild(renderingControls);
        
        const shortcutHelp = document.createElement('div');
        shortcutHelp.className = 'shortcut-help';
        shortcutHelp.innerHTML = `
            <h4><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h4>
            <ul>
                <li><kbd>Space</kbd> - Start/Stop</li>
                <li><kbd>R</kbd> - Randomize</li>
                <li><kbd>C</kbd> - Clear</li>
                <li><kbd>Ctrl+S</kbd> - Save</li>
                <li><kbd>Ctrl+L</kbd> - Load</li>
                <li><kbd>+</kbd>/<kbd>-</kbd> - Adjust Speed</li>
            </ul>
        `;
        shortcutHelp.style.padding = '10px';
        shortcutHelp.style.marginTop = '15px';
        shortcutHelp.style.backgroundColor = 'rgba(0,0,0,0.05)';
        shortcutHelp.style.borderRadius = '5px';
        advancedControls.appendChild(shortcutHelp);
        
        densitySlider.addEventListener('input', () => {
            densityValue.textContent = `${densitySlider.value}%`;
        });
        
        applyDensityButton.addEventListener('click', () => {
            this.randomizeGrid(parseInt(densitySlider.value) / 100);
        });
        
        exportButton.addEventListener('click', () => {
            this.exportPattern();
        });
        
        importButton.addEventListener('click', () => {
            this.importPattern();
        });
        
        renderModeInput.addEventListener('change', () => {
            this.useAnimationFrame = renderModeInput.checked;
            if (this.model.running) {
                this.stopSimulation();
                this.startSimulation();
            }
        });
        
        const container = document.querySelector('.container');
        container.appendChild(advancedControls);
    }

    toggleRunning() {
        // Check if trying to start the simulation with no living cells
        if (!this.model.running && !this.model.hasLivingCells()) {
            this.view.showNotification('Cannot start simulation - no living cells', false);
            return;
        }
        
        this.model.running = !this.model.running;
        this.view.updateControls();
        
        if (this.model.running) {
            this.startSimulation();
        } else {
            this.stopSimulation();
        }
    }

    // Start the simulation loop
    startSimulation() {
        // Do an initial check for living cells
        if (!this.model.hasLivingCells()) {
            this.model.running = false;
            this.view.updateControls();
            this.view.showNotification('Cannot start simulation - no living cells', false);
            return;
        }
        
        this.model.running = true;
        
        this.view.updateControls();
        
        
        if (this.useAnimationFrame) {
            this.lastUpdateTime = Date.now();
            this.view.startAnimatedRendering(() => {
                const currentTime = Date.now();
                if (currentTime - this.lastUpdateTime >= this.intervalSpeed) {
                    this.lastUpdateTime = currentTime;
                    const hasLivingCells = this.model.nextGeneration();
                    if (!hasLivingCells) {
                        // Stop simulation if no living cells
                        this.stopSimulation();
                        this.view.showNotification('Simulation stopped - no living cells', false);
                        return false;
                    }
                    return true;
                }
                return false;
            });
        } else {
            this.intervalId = setInterval(() => {
                const hasLivingCells = this.model.nextGeneration();
                if (!hasLivingCells) {
                    this.stopSimulation();
                    this.view.showNotification('Simulation stopped - no living cells', false);
                }
                this.view.updateGrid();
            }, this.intervalSpeed);
        }
    }

    stopSimulation() {
        if (this.useAnimationFrame) {
            this.view.stopAnimatedRendering();
        } else if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.model.running = false;
        this.view.updateControls();
        this.lastUpdateTime = null;
    }

    clearGrid() {
        if (this.model.running) {
            this.toggleRunning();
        }
        
        this.model.clear();
        this.view.updateGrid();
        this.view.showNotification('Grid cleared');
    }

    randomizeGrid(density = 0.3) {
        if (this.model.running) {
            this.toggleRunning();
        }
        
        this.model.randomize(density);
        this.view.updateGrid();
        this.view.showNotification(`Randomized with ${Math.round(density * 100)}% density`);
    }

    changeGridSize(size) {
        if (this.model.running) {
            this.toggleRunning();
        }
        
        const patternSelector = document.getElementById('patterns');
        const selectedPattern = patternSelector ? patternSelector.value : 'glider';
        
        this.model.resizeGrid(size);
        this.view.resizeGrid();
        
        this.model.applyPattern(selectedPattern);
        this.view.updateGrid();
        
        // Format pattern name for display
        const formattedName = selectedPattern
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .trim();
        
        // Mention scaling in notification
        let notification = `Grid size changed to ${size}x${size} with ${formattedName}`;
        if (size > 40) {
            notification += " (pattern scaled to fit)";
        }
        
        this.view.showNotification(notification);
    }

    changeSpeed(value) {
        // Convert speed value (0-10) to interval in milliseconds
        // Speed 0 = pause simulation
        // Speed 1 = 2000ms (very slow)
        // Speed 10 = 50ms (very fast)
        this.model.speed = value;
        
        // Special case for speed 0 - pause the simulation
        if (value == 0) {
            this.intervalSpeed = Number.MAX_SAFE_INTEGER;
            
            if (this.model.running) {
                this.stopSimulation();
                this.model.running = false; // Explicitly set running to false
            }
            
            // Update speed value display
            const speedValue = document.getElementById('speed-value');
            if (speedValue) {
                speedValue.textContent = value;
            }
            
            this.view.showNotification(`Simulation paused (speed set to ${value})`);
            return;
        }
        
        // Adjust the interval based on grid size for larger grids
        let baseInterval = Math.round(2000 / Math.pow(1.35, value));
        
        // Add extra time for the largest grid size (60x60)
        if (this.model.size === 60) {
            baseInterval = baseInterval * 1.2;
        }
        
        this.intervalSpeed = Math.round(baseInterval);
        
        const speedValue = document.getElementById('speed-value');
        if (speedValue) {
            speedValue.textContent = value;
        }
        
        if (this.model.running) {
            this.stopSimulation();
            this.startSimulation();
        }
        
        this.view.showNotification(`Speed set to ${value} (${this.intervalSpeed}ms)`);
    }

    applyPattern(patternName) {
        if (this.model.running) {
            this.toggleRunning();
        }
        
        this.model.applyPattern(patternName);
        this.view.updateGrid();
        
        // Format pattern name for display
        const formattedName = patternName
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .trim();
        
        let notification = `Applied pattern: ${formattedName}`;
        if (this.model.size > 40) {
            notification += " (scaled to fit)";
        }
        
        this.view.showNotification(notification);
    }

    // Toggle a cell state
    toggleCell(row, col) {
        this.model.toggleCell(row, col);
        this.view.updateGrid();
    }

    // Save the current state
    saveState() {
        const success = this.model.saveState();
        if (success) {
            this.view.showNotification('Game state saved!', true);
        } else {
            this.view.showNotification('Failed to save game state!', false);
        }
    }

    // Load a saved state
    loadState() {
        const success = this.model.loadState();
        if (success) {
            this.view.resizeGrid();
            this.view.updateGrid();
            this.view.showNotification('Game state loaded!', true);
        } else {
            this.view.showNotification('No saved game state found!', false);
        }
    }

    // Export the current pattern
    exportPattern() {
        this.view.showExportDialog();
    }

    // Import a pattern
    importPattern() {
        this.view.showImportDialog();
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
}); 