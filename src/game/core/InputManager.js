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

        // Setup orientation detection
        this.setupOrientationDetection();

        // Virtual Joystick - Dynamic positioning (appears where you touch)
        const joystickZone = document.getElementById('joystickZone');
        const joystickBase = joystickZone.querySelector('.joystick-base');
        const joystickStick = document.getElementById('joystickStick');
        let joystickActive = false;
        let joystickCenter = { x: 0, y: 0 };
        let joystickTouchId = null;
        const joystickMaxDistance = 45; // pixels

        const startJoystick = (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            joystickTouchId = touch.identifier;
            joystickActive = true;

            // Position joystick where user touched
            joystickCenter = {
                x: touch.clientX,
                y: touch.clientY
            };

            // Move the visual joystick to touch position
            joystickBase.style.left = `${touch.clientX - 75}px`;
            joystickBase.style.top = `${touch.clientY - 75}px`;
            joystickBase.style.position = 'fixed';
            joystickStick.style.left = `${touch.clientX}px`;
            joystickStick.style.top = `${touch.clientY}px`;
            joystickStick.style.position = 'fixed';
            joystickStick.style.transform = 'translate(-50%, -50%)';

            // Show the joystick
            joystickBase.style.opacity = '1';
            joystickStick.style.opacity = '1';
        };

        const moveJoystick = (e) => {
            if (!joystickActive) return;
            e.preventDefault();

            // Find the correct touch
            let touch = null;
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === joystickTouchId) {
                    touch = e.touches[i];
                    break;
                }
            }
            if (!touch) return;

            const deltaX = touch.clientX - joystickCenter.x;
            const deltaY = touch.clientY - joystickCenter.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > joystickMaxDistance) {
                this.joystick.x = (deltaX / distance) * 1.0;
                this.joystick.y = (deltaY / distance) * 1.0;
                joystickStick.style.left = `${joystickCenter.x + (deltaX / distance) * joystickMaxDistance}px`;
                joystickStick.style.top = `${joystickCenter.y + (deltaY / distance) * joystickMaxDistance}px`;
            } else {
                this.joystick.x = deltaX / joystickMaxDistance;
                this.joystick.y = deltaY / joystickMaxDistance;
                joystickStick.style.left = `${touch.clientX}px`;
                joystickStick.style.top = `${touch.clientY}px`;
            }
        };

        const endJoystick = (e) => {
            // Check if the ended touch is our joystick touch
            let found = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === joystickTouchId) {
                    found = true;
                    break;
                }
            }
            if (!found && e.type !== 'touchcancel') return;

            joystickActive = false;
            joystickTouchId = null;
            this.joystick.x = 0;
            this.joystick.y = 0;

            // Hide joystick
            joystickBase.style.opacity = '0';
            joystickStick.style.opacity = '0';
        };

        joystickZone.addEventListener('touchstart', startJoystick, { passive: false });
        joystickZone.addEventListener('touchmove', moveJoystick, { passive: false });
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

        // Shoot Button with Long-Press to Scope
        const shootButton = document.getElementById('shootButton');
        let longPressTimer = null;
        let isScoping = false;

        shootButton.addEventListener('touchstart', (e) => {
            e.preventDefault();

            // Start long-press timer for scoping (500ms)
            longPressTimer = setTimeout(() => {
                isScoping = true;
                this.mouseButtons[2] = true; // Simulate right click for scope
                shootButton.classList.add('scoping');
                console.log('Long press - entering scope mode');
            }, 500);
        });

        shootButton.addEventListener('touchend', (e) => {
            e.preventDefault();

            // Clear long-press timer
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // If we were scoping, exit scope
            if (isScoping) {
                this.mouseButtons[2] = false; // Release right click
                shootButton.classList.remove('scoping');
                console.log('Released - exiting scope mode');
                isScoping = false;
            } else {
                // Quick tap - fire shot
                this.mouseButtons[0] = true; // Left click
                console.log('Quick tap - firing shot');
                setTimeout(() => {
                    this.mouseButtons[0] = false;
                }, 50);
            }
        });

        shootButton.addEventListener('touchcancel', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            if (isScoping) {
                this.mouseButtons[2] = false;
                shootButton.classList.remove('scoping');
                isScoping = false;
            }
        });

        // Crouch Button
        const crouchButton = document.getElementById('crouchButton');
        crouchButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchCrouch = !this.touchCrouch;
            this.keys['KeyC'] = this.touchCrouch; // Simulate C key
            crouchButton.classList.toggle('active', this.touchCrouch);
        });

        // Jump Button
        const jumpButton = document.getElementById('jumpButton');
        jumpButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['Space'] = true; // Simulate Space key
        });
        jumpButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['Space'] = false;
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

    setupOrientationDetection() {
        const orientationMessage = document.querySelector('.orientation-message');
        const mobileControls = document.getElementById('mobileControls');

        const checkOrientation = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            console.log('Orientation check:', {
                width: window.innerWidth,
                height: window.innerHeight,
                isLandscape: isLandscape,
                orientation: screen.orientation ? screen.orientation.type : 'unknown'
            });

            if (orientationMessage) {
                if (isLandscape) {
                    orientationMessage.style.display = 'none';
                    if (mobileControls) {
                        mobileControls.style.display = 'block';
                    }
                } else {
                    orientationMessage.style.display = 'flex';
                    if (mobileControls) {
                        mobileControls.style.display = 'none';
                    }
                }
            }
        };

        // Check on load
        checkOrientation();

        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            console.log('Orientation changed event fired');
            setTimeout(checkOrientation, 100); // Small delay to ensure dimensions are updated
        });

        // Also listen to resize (more reliable on some devices)
        window.addEventListener('resize', checkOrientation);

        // Try to lock orientation to landscape (may not work on all browsers)
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').then(() => {
                console.log('Screen orientation locked to landscape');
            }).catch((error) => {
                console.log('Could not lock screen orientation:', error);
            });
        }
    }
}
