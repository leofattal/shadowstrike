export class UIManager {
    constructor() {
        this.healthFill = document.getElementById('healthFill');
        this.healthText = document.getElementById('healthText');
        this.ammoText = document.getElementById('ammoText');
        this.objectiveText = document.getElementById('objectiveText');
        this.enemyCount = document.getElementById('enemyCount');
        this.weaponName = document.getElementById('weaponName');
        this.fireMode = document.getElementById('fireMode');
        this.scopeOverlay = document.getElementById('scopeOverlay');
        this.coinsText = document.getElementById('coinsText');
        this.deathScreen = document.getElementById('deathScreen');
        this.deathStats = document.getElementById('deathStats');
        this.spawnWaveBtn = document.getElementById('spawnWaveBtn');
        this.respawnBtn = document.getElementById('respawnBtn');
        this.comboDisplay = document.getElementById('comboDisplay');
        this.comboText = document.getElementById('comboText');
        this.multiplierText = document.getElementById('multiplierText');
        this.killstreakDisplay = document.getElementById('killstreakDisplay');
        this.killstreakText = document.getElementById('killstreakText');
        this.hitMarker = document.getElementById('hitMarker');
        this.lootPrompt = null;
        this.createLootPrompt();
    }

    createLootPrompt() {
        this.lootPrompt = document.createElement('div');
        this.lootPrompt.id = 'lootPrompt';
        this.lootPrompt.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ffcc00;
            border-radius: 10px;
            padding: 15px 25px;
            color: white;
            font-family: 'Courier New', monospace;
            text-align: center;
            z-index: 3000;
            display: none;
        `;
        document.body.appendChild(this.lootPrompt);
    }

    updateScopeVisibility(isZooming) {
        if (isZooming) {
            this.scopeOverlay.classList.add('active');
        } else {
            this.scopeOverlay.classList.remove('active');
        }
    }

    updateScopeType(scopeType) {
        // Remove all possible scope classes
        this.scopeOverlay.classList.remove('sniper', 'heavy', 'rifle', 'explosive');

        // Add the new class if a valid type is provided
        if (scopeType && ['sniper', 'heavy', 'rifle', 'explosive'].includes(scopeType)) {
            this.scopeOverlay.classList.add(scopeType);
        }
    }

    updateHealth(current, max) {
        const percent = (current / max) * 100;
        this.healthFill.style.width = percent + '%';
        this.healthText.textContent = Math.round(current);

        // Change color based on health
        if (percent > 50) {
            this.healthFill.style.background = 'linear-gradient(to right, #00ff00, #66ff00)';
        } else if (percent > 25) {
            this.healthFill.style.background = 'linear-gradient(to right, #ffff00, #ff9900)';
        } else {
            this.healthFill.style.background = 'linear-gradient(to right, #ff0000, #ff6600)';
        }
    }

    updateAmmo(current, reserve) {
        this.ammoText.textContent = `${current}/${reserve}`;

        // Flash red if low on ammo
        if (current < 5) {
            this.ammoText.style.color = '#ff0000';
        } else {
            this.ammoText.style.color = '#ffffff';
        }
    }

    updateObjective(text) {
        this.objectiveText.textContent = text;
    }

    updateEnemyCount(alive, total) {
        this.enemyCount.textContent = `${alive}/${total}`;

        // Change color if all enemies dead
        if (alive === 0) {
            this.enemyCount.style.color = '#00ff00';
        } else {
            this.enemyCount.style.color = '#ffffff';
        }
    }

    updateWeaponInfo(name, mode) {
        this.weaponName.textContent = name;
        this.fireMode.textContent = mode;
    }

    updateCoins(amount) {
        this.coinsText.textContent = `💰 ${amount}`;
    }

    showDeathScreen(coins, enemiesKilled, killerMessage = '') {
        this.deathScreen.style.display = 'block';
        this.deathStats.innerHTML = `
            ${killerMessage ? `<div style="color: #ff6666; margin-bottom: 10px;">${killerMessage}</div>` : ''}
            <div>Coins: 💰 ${coins}</div>
            <div style="margin-top: 10px;">Kills: ☠️ ${enemiesKilled}</div>
            <div id="respawn-countdown" style="margin-top: 20px; font-size: 48px; color: #00ff00;">3</div>
        `;

        // Release pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        // Start countdown
        let countdown = 3;
        const countdownElement = document.getElementById('respawn-countdown');

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownElement.textContent = countdown;
            } else {
                countdownElement.textContent = 'RESPAWNING...';
                clearInterval(countdownInterval);
            }
        }, 1000);

        // Store interval ID so we can clear it if needed
        this.currentCountdownInterval = countdownInterval;
    }

    hideDeathScreen() {
        this.deathScreen.style.display = 'none';
    }

    updateComboDisplay(comboKills, multiplier, killstreak) {
        if (comboKills > 1) {
            this.comboDisplay.style.display = 'block';
            this.comboText.textContent = `COMBO x${comboKills}`;
            this.multiplierText.textContent = `${multiplier}x`;
        } else {
            this.comboDisplay.style.display = 'none';
        }

        if (killstreak >= 5) {
            this.killstreakDisplay.style.display = 'block';
            this.killstreakText.textContent = killstreak;
        } else {
            this.killstreakDisplay.style.display = 'none';
        }
    }

    showHitMarker(isHeadshot = false) {
        this.hitMarker.classList.remove('active', 'headshot');

        if (isHeadshot) {
            this.hitMarker.classList.add('headshot');
        }

        // Trigger animation
        setTimeout(() => {
            this.hitMarker.classList.add('active');
        }, 10);

        // Remove after animation
        setTimeout(() => {
            this.hitMarker.classList.remove('active', 'headshot');
        }, 220);
    }

    showMessage(message, duration = 3000) {
        // TODO: Implement message system
        console.log('Message:', message);
    }

    updateLootPrompt(loot) {
        if (loot) {
            let content = '<div style="font-size: 14px; color: #ffcc00; margin-bottom: 8px;">LOOT DROP</div>';

            if (loot.weapons && loot.weapons.length > 0) {
                content += `<div style="margin-bottom: 5px;">Weapons: ${loot.weapons.join(', ')}</div>`;
            }
            if (loot.coins > 0) {
                content += `<div style="margin-bottom: 5px;">Coins: ${loot.coins}</div>`;
            }
            content += '<div style="font-size: 12px; color: #aaa; margin-top: 8px;">Press [E] to pickup</div>';

            this.lootPrompt.innerHTML = content;
            this.lootPrompt.style.display = 'block';
        } else {
            this.lootPrompt.style.display = 'none';
        }
    }
}
