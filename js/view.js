/**
 * Game of Life - View
 * Handles the rendering of the game state to the UI
 */

class GameView {
    constructor(model) {
        this.model = model;
        this.gridContainer = document.getElementById('game-grid');
        this.cells = [];
        this.statsContainer = null;
        this.createStatsContainer();
        this.generationCounter = document.getElementById('generation-counter');
        
        this.animationFrameRequest = null;
        this.lastRenderTime = 0;
    }

    // Initialize the grid in the DOM
    initializeGrid() {
        this.gridContainer.innerHTML = '';
        
        const cellSize = this.getCellSize();
        this.gridContainer.style.gridTemplateColumns = `repeat(${this.model.size}, ${cellSize}px)`;
        this.gridContainer.style.gridTemplateRows = `repeat(${this.model.size}, ${cellSize}px)`;
        
        if (this.model.size <= 20) {
            this.gridContainer.style.gap = '0px'; // No gap for smaller grids
        } else {
            this.gridContainer.style.gap = '1px'; // Normal gap for larger grids
        }
        
        this.cells = [];
        
        for (let i = 0; i < this.model.size; i++) {
            const row = [];
            for (let j = 0; j < this.model.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (this.model.size > 20) {
                    cell.classList.add('with-radius');
                }
                
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                this.gridContainer.appendChild(cell);
                row.push(cell);
            }
            this.cells.push(row);
        }
    }

    // Calculate appropriate cell size based on screen size and grid size
    getCellSize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const minDimension = Math.min(screenWidth * 0.8, screenHeight * 0.6);
        
        if (this.model.size === 20) {
            return 15; // Largest size for 20x20
        } else if (this.model.size === 40) {
            return 12; // Smaller for 40x40
        } else if (this.model.size === 60) {
            return 9; // Even smaller for 60x60
        }
        
        
        let maxCellSize = Math.floor(minDimension / this.model.size);
        return Math.max(6, Math.min(maxCellSize, 15));
    }

    // Create the statistics container
    createStatsContainer() {
        if (document.getElementById('stats-container')) {
            this.statsContainer = document.getElementById('stats-container');
            return;
        }

        this.statsContainer = document.createElement('div');
        this.statsContainer.id = 'stats-container';
        this.statsContainer.className = 'stats-container';
        
        const statItems = ['Generation', 'Population', 'Births', 'Deaths'];
        statItems.forEach(item => {
            const statElement = document.createElement('div');
            statElement.id = `stat-${item.toLowerCase()}`;
            statElement.className = 'stat-item';
            
            const statLabel = document.createElement('span');
            statLabel.className = 'stat-label';
            statLabel.textContent = `${item}: `;
            
            const statValue = document.createElement('span');
            statValue.className = 'stat-value';
            statValue.textContent = '0';
            
            statElement.appendChild(statLabel);
            statElement.appendChild(statValue);
            
            this.statsContainer.appendChild(statElement);
        });
        
        const controlsElement = document.querySelector('.controls');
        controlsElement.parentNode.insertBefore(this.statsContainer, controlsElement.nextSibling);
        
        this.updateStats();
    }

    // Update the statistics display
    updateStats() {
        const stats = this.model.getStatistics();
        
        document.querySelector('#stat-generation .stat-value').textContent = stats.generation;
        document.querySelector('#stat-population .stat-value').textContent = stats.population;
        document.querySelector('#stat-births .stat-value').textContent = stats.birthCount;
        document.querySelector('#stat-deaths .stat-value').textContent = stats.deathCount;
        
        if (this.generationCounter) {
            this.generationCounter.textContent = stats.generation;
        }
    }

    // Update the UI to match the model state
    updateGrid() {
        for (let i = 0; i < this.model.size; i++) {
            for (let j = 0; j < this.model.size; j++) {
                const cell = this.cells[i][j];
                if (this.model.grid[i][j]) {
                    if (!cell.classList.contains('alive')) {
                        cell.classList.add('alive');
                        cell.classList.add('born');
                        setTimeout(() => {
                            cell.classList.remove('born');
                        }, 300);
                    }
                } else {
                    cell.classList.remove('alive');
                }
            }
        }
        
        this.updateStats();
    }

    // Render the grid
    startAnimatedRendering(updateCallback) {
        if (this.animationFrameRequest) {
            cancelAnimationFrame(this.animationFrameRequest);
        }
        
        const renderLoop = (timestamp) => {
            if (updateCallback()) {
                this.updateGrid();
            }
            
            this.animationFrameRequest = requestAnimationFrame(renderLoop);
        };
        
        this.animationFrameRequest = requestAnimationFrame(renderLoop);
    }
    
    // Stop animated rendering
    stopAnimatedRendering() {
        if (this.animationFrameRequest) {
            cancelAnimationFrame(this.animationFrameRequest);
            this.animationFrameRequest = null;
        }
    }

    // Resize the grid in the DOM
    resizeGrid() {
        this.initializeGrid();
        this.updateGrid();
    }

    // Update buttons based on game state
    updateControls() {
        const startStopButton = document.getElementById('start-stop');
        if (this.model.running) {
            startStopButton.innerHTML = '<i class="fas fa-pause"></i> Stop';
            startStopButton.classList.add('active');
        } else {
            startStopButton.innerHTML = '<i class="fas fa-play"></i> Start';
            startStopButton.classList.remove('active');
        }
    }

    // Update the pattern selector dropdown with all available patterns
    updatePatternSelector() {
        const patternSelector = document.getElementById('patterns');
        const patterns = this.model.getPatterns();
        
        patternSelector.innerHTML = '';
        
        patterns.forEach(pattern => {
            const option = document.createElement('option');
            option.value = pattern;
            option.textContent = pattern.charAt(0).toUpperCase() + pattern.slice(1)
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .trim();
            patternSelector.appendChild(option);
        });
        
        if (patterns.length > 0) {
            patternSelector.value = patterns[0];
        }
    }

    // Handle window resize events to adjust the grid
    handleResize() {
        if (this.cells.length > 0) {
            this.resizeGrid();
        }
    }

    // Display a notification to the user
    showNotification(message, isSuccess = true) {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.querySelector('.container').appendChild(notification);
        }
        
        notification.style.backgroundColor = isSuccess ? '#2ecc71' : '#e74c3c';
        notification.innerHTML = isSuccess 
            ? `<i class="fas fa-check-circle"></i> ${message}` 
            : `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        notification.style.opacity = '1';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Show a dialog to export the current pattern
    showExportDialog() {
        const patternData = this.model.exportPattern();
        if (!patternData) {
            this.showNotification('No pattern to export', false);
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const title = document.createElement('h3');
        title.innerHTML = '<i class="fas fa-file-export"></i> Export Pattern';
        
        const textArea = document.createElement('textarea');
        textArea.value = patternData;
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i> Close';
        closeButton.onclick = () => {
            document.body.removeChild(modal);
        };
        
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
        copyButton.style.marginRight = '10px';
        copyButton.onclick = () => {
            textArea.select();
            document.execCommand('copy');
            this.showNotification('Copied to clipboard!');
        };
        
        dialog.appendChild(title);
        dialog.appendChild(textArea);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '15px';
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);
        
        dialog.appendChild(buttonContainer);
        modal.appendChild(dialog);
        
        document.body.appendChild(modal);
    }

    // Show a dialog to import a pattern
    showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const title = document.createElement('h3');
        title.innerHTML = '<i class="fas fa-file-import"></i> Import Pattern';
        
        const textArea = document.createElement('textarea');
        textArea.placeholder = 'Paste pattern data here...';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        closeButton.onclick = () => {
            document.body.removeChild(modal);
        };
        
        const importButton = document.createElement('button');
        importButton.innerHTML = '<i class="fas fa-file-import"></i> Import';
        importButton.style.marginRight = '10px';
        importButton.onclick = () => {
            const success = this.model.importPattern(textArea.value);
            if (success) {
                this.updateGrid();
                this.showNotification('Pattern imported successfully!');
                document.body.removeChild(modal);
            } else {
                this.showNotification('Failed to import pattern', false);
            }
        };
        
        dialog.appendChild(title);
        dialog.appendChild(textArea);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '15px';
        buttonContainer.appendChild(importButton);
        buttonContainer.appendChild(closeButton);
        
        dialog.appendChild(buttonContainer);
        modal.appendChild(dialog);
        
        document.body.appendChild(modal);
    }
} 