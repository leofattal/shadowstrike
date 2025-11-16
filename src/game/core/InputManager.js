export class InputManager {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.keys = {};
        this.mouseButtons = {};
        this.mouseDelta = { x: 0, y: 0 };
        this.isPointerLocked = false;

        // Mobile touch controls
        this.isMobile = this.detectMobile();
        this.joystick = { x: 0, y: 0 }; // Normalized -1 to 1
        this.touchLook = { x: 0, y: 0 }; // Touch delta for camera
        this.touchShoot = false;
        this.touchCrouch = false;
        this.touchReload = false;

        this.setupInputListeners();
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
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
            console.log('Pointer lock changed:', this.isPointerLocked);

            // If pointer lock was lost, try to reacquire it
            if (!this.isPointerLocked && this.wasPointerLocked) {
                console.log('Pointer lock lost, attempting to reacquire');
                setTimeout(() => {
                    this.requestPointerLock();
                }, 100);
            }

            this.wasPointerLocked = this.isPointerLocked;
        });

        // Request pointer lock on canvas click (desktop only)
        this.canvas.addEventListener('click', () => {
            if (!this.isMobile) {
                this.requestPointerLock();
            }
        });

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        });
    }

    requestPointerLock() {
        if (!this.isPointerLocked && this.canvas.requestPointerLock) {
            this.canvas.requestPointerLock();
        }
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
        // On mobile, use touch look delta
        if (this.isMobile) {
            const delta = { ...this.touchLook };
            this.touchLook.x = 0;
            this.touchLook.y = 0;
            return delta;
        }

        // If pointer lock is not active, return zero delta to prevent camera jumps
        if (!this.isPointerLocked) {
            this.mouseDelta.x = 0;
            this.mouseDelta.y = 0;
            return { x: 0, y: 0 };
        }

        const delta = { ...this.mouseDelta };
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return delta;
    }

    getMovementInput() {
        // On mobile, use joystick input
        if (this.isMobile) {
            return {
                forward: -this.joystick.y, // Invert Y for forward/backward
                right: this.joystick.x
            };
        }

        // Desktop keyboard input
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
        return this.isKeyDown('KeyC') || this.touchCrouch;
    }

    setupMobileControls() {
        console.log('Setting up mobile controls');

        // Virtual Joystick
        const joystickZone = document.getElementById('joystickZone');
        const joystickStick = document.getElementById('joystickStick');
        let joystickActive = false;
        let joystickCenter = { x: 0, y: 0 };
        const joystickMaxDistance = 45; // pixels

        const startJoystick = (e) => {
            joystickActive = true;
            const rect = joystickZone.getBoundingClientRect();
            joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        };

        const moveJoystick = (e) => {
            if (!joystickActive) return;

            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - joystickCenter.x;
            const deltaY = touch.clientY - joystickCenter.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > joystickMaxDistance) {
                this.joystick.x = (deltaX / distance) * 1.0;
                this.joystick.y = (deltaY / distance) * 1.0;
                joystickStick.style.transform = `translate(-50%, -50%) translate(${(deltaX / distance) * joystickMaxDistance}px, ${(deltaY / distance) * joystickMaxDistance}px)`;
            } else {
                this.joystick.x = deltaX / joystickMaxDistance;
                this.joystick.y = deltaY / joystickMaxDistance;
                joystickStick.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
            }
        };

        const endJoystick = () => {
            joystickActive = false;
            this.joystick.x = 0;
            this.joystick.y = 0;
            joystickStick.style.transform = 'translate(-50%, -50%)';
        };

        joystickZone.addEventListener('touchstart', startJoystick);
        joystickZone.addEventListener('touchmove', moveJoystick);
        joystickZone.addEventListener('touchend', endJoystick);
        joystickZone.addEventListener('touchcancel', endJoystick);

        // Look/Aim Zone
        const lookZone = document.getElementById('lookZone');
        let lastLookTouch = null;

        const moveLook = (e) => {
            e.preventDefault();
            const touch = e.touches[0];

            if (lastLookTouch) {
                this.touchLook.x = touch.clientX - lastLookTouch.x;
                this.touchLook.y = touch.clientY - lastLookTouch.y;
            }

            lastLookTouch = { x: touch.clientX, y: touch.clientY };
        };

        const endLook = () => {
            lastLookTouch = null;
            this.touchLook.x = 0;
            this.touchLook.y = 0;
        };

        lookZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            lastLookTouch = null;
        });
        lookZone.addEventListener('touchmove', moveLook);
        lookZone.addEventListener('touchend', endLook);
        lookZone.addEventListener('touchcancel', endLook);

        // Shoot Button
        const shootButton = document.getElementById('shootButton');
        shootButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchShoot = true;
            this.mouseButtons[0] = true; // Simulate left click
        });
        shootButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchShoot = false;
            this.mouseButtons[0] = false;
        });

        // Crouch Button
        const crouchButton = document.getElementById('crouchButton');
        crouchButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchCrouch = !this.touchCrouch;
            this.keys['KeyC'] = this.touchCrouch; // Simulate C key
            crouchButton.classList.toggle('active', this.touchCrouch);
        });

        // Reload Button
        const reloadButton = document.getElementById('reloadButton');
        reloadButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['KeyR'] = true; // Simulate R key
            setTimeout(() => {
                this.keys['KeyR'] = false;
            }, 100);
        });
    }
}
