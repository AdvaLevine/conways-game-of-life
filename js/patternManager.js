/**
 * Pattern Manager for Conway's Game of Life
 * Handles pattern visualization, selection, and application
 */

class PatternManager {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPattern = 'glider';
        this.patternDescriptions = {
            glider: 'A glider that moves diagonally across the grid.',
            blinker: 'A simple oscillator that alternates between horizontal and vertical states.',
            toad: 'A period-2 oscillator that appears to hop from side to side.',
            beacon: 'A period-2 oscillator where two corners "flash" on and off.',
            pulsar: 'A complex period-3 oscillator, one of the largest and most common oscillators.',
            gosperGliderGun: 'Creates a continuous stream of gliders.',
        };
    }

    // Create visual pattern selection gallery
    createPatternGallery(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const gallery = document.createElement('div');
        gallery.className = 'pattern-gallery';
        
        const patterns = this.model.getPatterns();
        
        patterns.forEach(patternName => {
            const card = this.createPatternCard(patternName);
            gallery.appendChild(card);
        });
        
        container.appendChild(gallery);
    }
    
    // Create a card for a single pattern
    createPatternCard(patternName) {
        const card = document.createElement('div');
        card.className = 'pattern-card';
        card.dataset.pattern = patternName;
        
        if (patternName === this.selectedPattern) {
            card.classList.add('selected');
        }
        
        const preview = document.createElement('div');
        preview.className = 'pattern-preview';
        
        const pattern = this.model.patterns[patternName];
        
        const rows = pattern.length;
        const cols = pattern[0].length;
        preview.style.setProperty('--preview-rows', rows);
        preview.style.setProperty('--preview-cols', cols);
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'pattern-preview-cell';
                if (pattern[i][j] === 1) {
                    cell.classList.add('alive');
                }
                preview.appendChild(cell);
            }
        }
        
        const name = document.createElement('div');
        name.className = 'pattern-name';
        name.textContent = this.formatPatternName(patternName);
        
        card.appendChild(preview);
        card.appendChild(name);
        
        card.addEventListener('click', () => {
            this.selectPattern(patternName);
        });
        
        return card;
    }
    
    // Format pattern name for display
    formatPatternName(patternName) {
        return patternName
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .charAt(0).toUpperCase() + patternName.replace(/([A-Z])/g, ' $1').slice(1) // Capitalize first letter
            .trim();
    }
    
    // Select a pattern
    selectPattern(patternName) {
        this.selectedPattern = patternName;
        
        document.querySelectorAll('.pattern-card').forEach(card => {
            if (card.dataset.pattern === patternName) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        const patternSelect = document.getElementById('patterns');
        if (patternSelect) {
            patternSelect.value = patternName;
        }
    }
    
    // Apply the currently selected pattern
    applySelectedPattern() {
        this.model.applyPattern(this.selectedPattern);
        this.view.updateGrid();
        this.view.showNotification(`Applied pattern: ${this.formatPatternName(this.selectedPattern)}`);
    }
    
    // Show pattern info dialog
    showPatternInfo(patternName) {
        if (!patternName) patternName = this.selectedPattern;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const title = document.createElement('h3');
        title.innerHTML = `<i class="fas fa-info-circle"></i> ${this.formatPatternName(patternName)}`;
        
        const preview = document.createElement('div');
        preview.className = 'pattern-preview';
        preview.style.width = '150px';
        preview.style.height = '150px';
        preview.style.margin = '0 auto 20px';
        
        const pattern = this.model.patterns[patternName];
        
        const rows = pattern.length;
        const cols = pattern[0].length;
        preview.style.setProperty('--preview-rows', rows);
        preview.style.setProperty('--preview-cols', cols);
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'pattern-preview-cell';
                if (pattern[i][j] === 1) {
                    cell.classList.add('alive');
                }
                preview.appendChild(cell);
            }
        }
        
        const description = document.createElement('p');
        description.style.marginBottom = '20px';
        description.textContent = this.patternDescriptions[patternName] || 'No description available.';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        
        const applyButton = document.createElement('button');
        applyButton.innerHTML = '<i class="fas fa-check"></i> Apply';
        applyButton.onclick = () => {
            this.selectPattern(patternName);
            this.applySelectedPattern();
            document.body.removeChild(modal);
        };
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i> Close';
        closeButton.onclick = () => {
            document.body.removeChild(modal);
        };
        
        buttonContainer.appendChild(applyButton);
        buttonContainer.appendChild(closeButton);
        
        dialog.appendChild(title);
        dialog.appendChild(preview);
        dialog.appendChild(description);
        dialog.appendChild(buttonContainer);
        modal.appendChild(dialog);
        
        document.body.appendChild(modal);
    }
    
    // Create a custom pattern editor
    showPatternEditor() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const title = document.createElement('h3');
        title.innerHTML = '<i class="fas fa-edit"></i> Pattern Editor';
        
        const editorContainer = document.createElement('div');
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        editorContainer.style.gap = '15px';
        
        const sizeControl = document.createElement('div');
        sizeControl.style.display = 'flex';
        sizeControl.style.alignItems = 'center';
        sizeControl.style.gap = '10px';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.htmlFor = 'editor-size';
        sizeLabel.textContent = 'Grid Size:';
        
        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.id = 'editor-size';
        sizeInput.min = '3';
        sizeInput.max = '20';
        sizeInput.value = '8';
        
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        
        sizeControl.appendChild(sizeLabel);
        sizeControl.appendChild(sizeInput);
        sizeControl.appendChild(updateButton);
        
        const editorGrid = document.createElement('div');
        editorGrid.className = 'pattern-preview';
        editorGrid.style.width = '250px';
        editorGrid.style.height = '250px';
        editorGrid.style.margin = '0 auto';
        
        let gridSize = 8;
        this.createEditorGrid(editorGrid, gridSize);
        
        updateButton.addEventListener('click', () => {
            gridSize = parseInt(sizeInput.value);
            if (gridSize < 3) gridSize = 3;
            if (gridSize > 20) gridSize = 20;
            sizeInput.value = gridSize;
            this.createEditorGrid(editorGrid, gridSize);
        });
        
        const nameContainer = document.createElement('div');
        nameContainer.style.marginTop = '15px';
        
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'pattern-name';
        nameLabel.textContent = 'Pattern Name:';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'pattern-name';
        nameInput.placeholder = 'Enter a name for your pattern';
        
        nameContainer.appendChild(nameLabel);
        nameContainer.appendChild(nameInput);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '15px';
        
        const saveButton = document.createElement('button');
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save & Apply';
        saveButton.onclick = () => {
            const name = nameInput.value.trim();
            if (!name) {
                this.view.showNotification('Please enter a pattern name', false);
                return;
            }
            
            const pattern = this.getPatternFromEditor(editorGrid, gridSize);
            
            const safeName = name.replace(/\s+/g, '');
            this.model.patterns[safeName] = pattern;
            
            this.patternDescriptions[safeName] = `Custom pattern created by user.`;
            
            this.selectPattern(safeName);
            this.applySelectedPattern();
            
            const galleryContainer = document.getElementById('pattern-gallery');
            if (galleryContainer) {
                this.createPatternGallery('pattern-gallery');
            }
            
            document.body.removeChild(modal);
        };
        
        const cancelButton = document.createElement('button');
        cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelButton.onclick = () => {
            document.body.removeChild(modal);
        };
        
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        
        editorContainer.appendChild(sizeControl);
        editorContainer.appendChild(editorGrid);
        editorContainer.appendChild(nameContainer);
        
        dialog.appendChild(title);
        dialog.appendChild(editorContainer);
        dialog.appendChild(buttonContainer);
        modal.appendChild(dialog);
        
        document.body.appendChild(modal);
    }
    
    // Create editor grid with given size
    createEditorGrid(container, size) {
        container.innerHTML = '';
        container.style.setProperty('--preview-rows', size);
        container.style.setProperty('--preview-cols', size);
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'pattern-preview-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => {
                    cell.classList.toggle('alive');
                });
                
                container.appendChild(cell);
            }
        }
    }
    
    // Get pattern from editor grid
    getPatternFromEditor(editorGrid, size) {
        const pattern = [];
        
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const cell = editorGrid.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                row.push(cell.classList.contains('alive') ? 1 : 0);
            }
            pattern.push(row);
        }
        
        return pattern;
    }
} 