/**
 * SplatDropZone - Drag and drop interface for loading .ply Gaussian Splat files
 */
export class SplatDropZone {
    constructor(onFileDropped) {
        this.onFileDropped = onFileDropped;
        this.dropZone = null;
        this.isActive = false;
    }

    /**
     * Initialize the drop zone UI
     */
    init() {
        console.log('🎯 Initializing Gaussian Splat drop zone...');

        // Create drop zone overlay
        this.dropZone = document.createElement('div');
        this.dropZone.id = 'splatDropZone';
        this.dropZone.innerHTML = `
            <div class="drop-zone-content">
                <div class="drop-icon">📁</div>
                <h2>Drop Gaussian Splat (.ply) File</h2>
                <p>Drag and drop a .ply file to use as your battlefield</p>
                <p style="font-size: 12px; color: #888; margin-top: 10px;">Or click anywhere to browse files</p>
                <button id="clearSplatBtn" style="display: none;">Clear Splat</button>
                <input type="file" id="splatFileInput" accept=".ply" style="display: none;">
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #splatDropZone {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                pointer-events: none;
            }

            #splatDropZone.active {
                display: flex;
                pointer-events: all;
            }

            .drop-zone-content {
                text-align: center;
                color: white;
                padding: 40px;
                border: 3px dashed #00ff00;
                border-radius: 20px;
                background: rgba(0, 50, 0, 0.3);
            }

            .drop-icon {
                font-size: 80px;
                margin-bottom: 20px;
            }

            #clearSplatBtn {
                margin-top: 20px;
                padding: 10px 20px;
                font-size: 16px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            #clearSplatBtn:hover {
                background: #ff6666;
            }

            #splatLoadIndicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 18px;
                z-index: 10001;
                display: none;
            }

            #splatLoadIndicator.active {
                display: block;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.dropZone);

        // Create loading indicator
        this.loadIndicator = document.createElement('div');
        this.loadIndicator.id = 'splatLoadIndicator';
        this.loadIndicator.textContent = 'Loading Gaussian Splat...';
        document.body.appendChild(this.loadIndicator);

        // Set up event listeners
        this.setupDragAndDrop();

        // Clear button
        const clearBtn = document.getElementById('clearSplatBtn');
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearSplat();
        });

        // File input for clicking to browse
        const fileInput = document.getElementById('splatFileInput');
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.name.toLowerCase().endsWith('.ply')) {
                this.hide();
                this.showLoadingIndicator();
                const success = await this.onFileDropped(file);
                this.hideLoadingIndicator();
                if (success) {
                    document.getElementById('clearSplatBtn').style.display = 'block';
                } else {
                    alert('Failed to load Gaussian Splat file. Please check the console for errors.');
                }
            }
        });

        // Click drop zone content to open file picker
        const dropZoneContent = this.dropZone.querySelector('.drop-zone-content');
        dropZoneContent.addEventListener('click', (e) => {
            if (e.target !== clearBtn) {
                fileInput.click();
            }
        });

        // Create a visible load button in the UI
        this.createLoadButton();

        console.log('✅ Gaussian Splat drop zone initialized!');
    }

    /**
     * Create a visible button to load splat files
     */
    createLoadButton() {
        const loadBtn = document.createElement('button');
        loadBtn.id = 'loadSplatBtn';
        loadBtn.textContent = '📁 Load .ply Splat';
        loadBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background: rgba(0, 255, 0, 0.2);
            color: #00ff00;
            border: 2px solid #00ff00;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 1000;
            transition: all 0.3s;
        `;

        loadBtn.addEventListener('mouseenter', () => {
            loadBtn.style.background = 'rgba(0, 255, 0, 0.4)';
        });

        loadBtn.addEventListener('mouseleave', () => {
            loadBtn.style.background = 'rgba(0, 255, 0, 0.2)';
        });

        loadBtn.addEventListener('click', () => {
            this.show();
        });

        document.body.appendChild(loadBtn);
    }

    /**
     * Set up drag and drop event handlers
     */
    setupDragAndDrop() {
        // Prevent default drag behaviors on the window
        window.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        window.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Show drop zone when dragging over window
        window.addEventListener('dragenter', (e) => {
            if (e.dataTransfer.types.includes('Files')) {
                this.show();
            }
        });

        // Hide drop zone when leaving
        this.dropZone.addEventListener('dragleave', (e) => {
            if (e.target === this.dropZone) {
                this.hide();
            }
        });

        // Handle file drop
        this.dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const files = Array.from(e.dataTransfer.files);
            const plyFile = files.find(f => f.name.toLowerCase().endsWith('.ply'));

            if (plyFile) {
                this.hide();
                this.showLoadingIndicator();

                const success = await this.onFileDropped(plyFile);

                this.hideLoadingIndicator();

                if (success) {
                    // Show clear button
                    document.getElementById('clearSplatBtn').style.display = 'block';
                } else {
                    alert('Failed to load Gaussian Splat file. Please check the console for errors.');
                }
            } else {
                alert('Please drop a .ply file');
                this.hide();
            }
        });

        // Allow clicking drop zone to close it
        this.dropZone.addEventListener('click', (e) => {
            if (e.target === this.dropZone) {
                this.hide();
            }
        });
    }

    /**
     * Show the drop zone
     */
    show() {
        this.dropZone.classList.add('active');
        this.isActive = true;
    }

    /**
     * Hide the drop zone
     */
    hide() {
        this.dropZone.classList.remove('active');
        this.isActive = false;
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        this.loadIndicator.classList.add('active');
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        this.loadIndicator.classList.remove('active');
    }

    /**
     * Clear the splat (callback to game)
     */
    clearSplat() {
        if (confirm('Are you sure you want to clear the Gaussian Splat battlefield?')) {
            this.hide();
            // Trigger clear event
            if (this.onClearSplat) {
                this.onClearSplat();
            }
            document.getElementById('clearSplatBtn').style.display = 'none';
        }
    }

    /**
     * Set clear callback
     */
    onClear(callback) {
        this.onClearSplat = callback;
    }
}
