export class InputManager {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.keys = {};
        this.mouseButtons = {};
        this.mouseDelta = { x: 0, y: 0 };
        this.isPointerLocked = false;

        this.setupInputListeners();
    }

    setupInputListeners() {
        // Keyboard events
        window.addEventListener('keydown', (evt) => {
            this.keys[evt.code] = true;
        });

        window.addEventListener('keyup', (evt) => {
            this.keys[evt.code] = false;
        });

        // Mouse events
        this.canvas.addEventListener('mousedown', (evt) => {
            this.mouseButtons[evt.button] = true;
        });

        this.canvas.addEventListener('mouseup', (evt) => {
            this.mouseButtons[evt.button] = false;
        });

        // Mouse movement
        this.canvas.addEventListener('mousemove', (evt) => {
            if (this.isPointerLocked) {
                this.mouseDelta.x += evt.movementX || 0;
                this.mouseDelta.y += evt.movementY || 0;
            }
        });

        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === this.canvas;
        });

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        });
    }

    isKeyDown(code) {
        return this.keys[code] === true;
    }

    isKeyPressed(code) {
        const pressed = this.keys[code] === true;
        if (pressed) {
            this.keys[code] = false; // Consume the press
        }
        return pressed;
    }

    isMouseButtonDown(button) {
        return this.mouseButtons[button] === true;
    }

    getMouseDelta() {
        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    getMovementInput() {
        const forward = this.isKeyDown('KeyW') ? 1 : (this.isKeyDown('KeyS') ? -1 : 0);
        const right = this.isKeyDown('KeyD') ? 1 : (this.isKeyDown('KeyA') ? -1 : 0);
        return { forward, right };
    }

    isSprintPressed() {
        return this.isKeyDown('ShiftLeft') || this.isKeyDown('ShiftRight');
    }

    isJumpPressed() {
        return this.isKeyPressed('Space');
    }

    isCrouchPressed() {
        return this.isKeyDown('KeyC');
    }
}
