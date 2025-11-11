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

    showDeathScreen(coins, enemiesKilled) {
        this.deathScreen.style.display = 'block';
        this.deathStats.innerHTML = `
            <div>Coins Earned: 💰 ${coins}</div>
            <div style="margin-top: 10px;">Enemies Killed: ☠️ ${enemiesKilled}</div>
        `;

        // Release pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    hideDeathScreen() {
        this.deathScreen.style.display = 'none';
    }

    showMessage(message, duration = 3000) {
        // TODO: Implement message system
        console.log('Message:', message);
    }
}
