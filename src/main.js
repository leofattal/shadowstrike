import * as BABYLON from '@babylonjs/core';
import { Game } from './game/Game.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const loading = document.getElementById('loading');

    // Initialize the game
    const game = new Game(canvas);

    // Start the game
    game.start().then(() => {
        // Hide loading screen
        loading.style.display = 'none';
        console.log('Game started successfully!');
    }).catch(error => {
        console.error('Failed to start game:', error);
        loading.innerHTML = '<div style="color: red;">Failed to load game. Check console for details.</div>';
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        game.resize();
    });
});
