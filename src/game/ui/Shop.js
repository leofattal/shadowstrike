import { WeaponTypes, WeaponUpgrades } from '../weapons/WeaponTypes.js';

export class Shop {
    constructor(player) {
        this.player = player;
        this.isOpen = false;
        this.selectedIndex = 0;
        this.selectableItems = [];
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.createShopUI();
    }

    createShopUI() {
        const shopContainer = document.createElement('div');
        shopContainer.id = 'shop';
        shopContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ffcc00;
            padding: 30px;
            border-radius: 10px;
            color: white;
            font-family: 'Courier New', monospace;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
            z-index: 2000;
        `;

        const title = document.createElement('h2');
        title.textContent = '🛒 WEAPON SHOP';
        title.style.cssText = 'color: #ffcc00; text-align: center; margin-bottom: 20px;';
        shopContainer.appendChild(title);

        const coinsDisplay = document.createElement('div');
        coinsDisplay.id = 'shopCoins';
        coinsDisplay.style.cssText = 'text-align: center; font-size: 18px; margin-bottom: 20px;';
        coinsDisplay.textContent = `Your Coins: 💰 ${this.player.coins}`;
        shopContainer.appendChild(coinsDisplay);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'CLOSE (ESC)';
        closeButton.style.cssText = `
            background: #ff4444;
            border: 2px solid #ff6666;
            color: white;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
            display: block;
            margin: 0 auto 20px;
        `;
        closeButton.onclick = () => this.close();
        shopContainer.appendChild(closeButton);

        // Weapons section
        const weaponsTitle = document.createElement('h3');
        weaponsTitle.textContent = 'WEAPONS';
        weaponsTitle.style.cssText = 'color: #ffcc00; margin-top: 20px; border-bottom: 2px solid #ffcc00; padding-bottom: 5px;';
        shopContainer.appendChild(weaponsTitle);

        const weaponsGrid = document.createElement('div');
        weaponsGrid.id = 'weaponsGrid';
        weaponsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;';
        shopContainer.appendChild(weaponsGrid);

        // Upgrades section
        const upgradesTitle = document.createElement('h3');
        upgradesTitle.textContent = 'UPGRADES (for current weapon)';
        upgradesTitle.style.cssText = 'color: #ffcc00; margin-top: 30px; border-bottom: 2px solid #ffcc00; padding-bottom: 5px;';
        shopContainer.appendChild(upgradesTitle);

        const upgradesGrid = document.createElement('div');
        upgradesGrid.id = 'upgradesGrid';
        upgradesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; margin: 15px 0;';
        shopContainer.appendChild(upgradesGrid);

        document.body.appendChild(shopContainer);
        this.shopContainer = shopContainer;
        this.coinsDisplay = coinsDisplay;
        this.weaponsGrid = weaponsGrid;
        this.upgradesGrid = upgradesGrid;

        // Add ESC key listener
        document.addEventListener('keydown', (evt) => {
            if (evt.code === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.shopContainer.style.display = 'block';
        this.refresh();
        document.addEventListener('keydown', this.handleKeyDown);

        // Lock pointer will be released automatically when UI appears
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    close() {
        this.isOpen = false;
        this.shopContainer.style.display = 'none';
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    refresh() {
        // Update coins display
        this.coinsDisplay.textContent = `Your Coins: 💰 ${this.player.coins}`;

        // Clear existing items
        this.weaponsGrid.innerHTML = '';
        this.upgradesGrid.innerHTML = '';
        this.selectableItems = [];

        // Add weapons
        Object.entries(WeaponTypes).forEach(([key, weapon]) => {
            const weaponCard = this.createWeaponCard(key, weapon);
            this.weaponsGrid.appendChild(weaponCard);
            if (weaponCard.querySelector('button')) {
                this.selectableItems.push(weaponCard);
            }
        });

        // Add upgrades
        Object.entries(WeaponUpgrades).forEach(([key, upgrade]) => {
            // Only show Blast Radius upgrade for explosive weapons
            if (key === 'BLAST_RADIUS') {
                const currentWeaponStats = WeaponTypes[this.player.currentWeapon];
                if (!currentWeaponStats.hasExplosiveAmmo) {
                    return; // Skip this upgrade for non-explosive weapons
                }
            }

            const upgradeCard = this.createUpgradeCard(key, upgrade);
            this.upgradesGrid.appendChild(upgradeCard);
            if (upgradeCard.querySelector('button')) {
                this.selectableItems.push(upgradeCard);
            }
        });

        this.updateSelection();
    }

    updateSelection() {
        this.selectableItems.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    handleKeyDown(evt) {
        if (!this.isOpen) return;

        switch (evt.code) {
            case 'ArrowUp':
                evt.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + this.selectableItems.length) % this.selectableItems.length;
                this.updateSelection();
                break;
            case 'ArrowDown':
                evt.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % this.selectableItems.length;
                this.updateSelection();
                break;
            case 'Enter':
                evt.preventDefault();
                const selectedItem = this.selectableItems[this.selectedIndex];
                if (selectedItem) {
                    const button = selectedItem.querySelector('button');
                    if (button) {
                        button.click();
                    }
                }
                break;
        }
    }

    createWeaponCard(weaponKey, weapon) {
        const card = document.createElement('div');
        card.classList.add('shop-card');
        const isOwned = this.player.ownedWeapons && this.player.ownedWeapons.includes(weaponKey);
        const isEquipped = this.player.currentWeapon === weaponKey;

        card.style.cssText = `
            background: ${isEquipped ? 'rgba(0, 255, 0, 0.2)' : 'rgba(50, 50, 50, 0.8)'};
            border: 2px solid ${isEquipped ? '#00ff00' : '#666'};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        `;

        card.innerHTML = `
            <div style="font-weight: bold; color: #ffcc00; margin-bottom: 10px;">${weapon.name}</div>
            <div style="font-size: 12px; margin: 5px 0;">DMG: ${weapon.damage}</div>
            <div style="font-size: 12px; margin: 5px 0;">Ammo: ${weapon.maxAmmo}/${weapon.reserveAmmo}</div>
            <div style="font-size: 12px; margin: 5px 0;">Rate: ${(1/weapon.fireRate).toFixed(1)}/s</div>
            ${weapon.hasExplosiveAmmo ? '<div style="color: #ff6600; font-size: 12px;">💥 EXPLOSIVE</div>' : ''}
            ${isOwned ? (isEquipped ? '<div style="color: #00ff00; margin-top: 10px;">EQUIPPED</div>' : '') : `<div style="margin-top: 10px;">💰 ${weapon.price}</div>`}
        `;

        if (!isOwned && weapon.price > 0) {
            const buyButton = document.createElement('button');
            buyButton.textContent = 'BUY';
            buyButton.style.cssText = `
                background: ${this.player.coins >= weapon.price ? '#00cc00' : '#666'};
                border: 2px solid ${this.player.coins >= weapon.price ? '#00ff00' : '#888'};
                color: white;
                padding: 5px 15px;
                margin-top: 10px;
                cursor: ${this.player.coins >= weapon.price ? 'pointer' : 'not-allowed'};
                border-radius: 5px;
                font-family: 'Courier New', monospace;
            `;
            buyButton.onclick = () => this.buyWeapon(weaponKey, weapon);
            card.appendChild(buyButton);
        } else if (isOwned && !isEquipped) {
            const equipButton = document.createElement('button');
            equipButton.textContent = 'EQUIP';
            equipButton.style.cssText = `
                background: #0088cc;
                border: 2px solid #00aaff;
                color: white;
                padding: 5px 15px;
                margin-top: 10px;
                cursor: pointer;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
            `;
            equipButton.onclick = () => this.equipWeapon(weaponKey);
            card.appendChild(equipButton);
        }

        return card;
    }

    createUpgradeCard(upgradeKey, upgrade) {
        const card = document.createElement('div');
        card.classList.add('shop-card');
        const hasUpgrade = this.player.weaponUpgrades && this.player.weaponUpgrades[upgradeKey];

        card.style.cssText = `
            background: ${hasUpgrade ? 'rgba(0, 255, 0, 0.2)' : 'rgba(50, 50, 50, 0.8)'};
            border: 2px solid ${hasUpgrade ? '#00ff00' : '#666'};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        `;

        // Get upgrade description
        let description = '';
        if (upgradeKey === 'DAMAGE') {
            description = `+${((upgrade.damageMultiplier - 1) * 100).toFixed(0)}% damage`;
        } else if (upgradeKey === 'FIRE_RATE') {
            description = `${((1 - upgrade.fireRateMultiplier) * 100).toFixed(0)}% faster`;
        } else if (upgradeKey === 'AMMO_CAPACITY') {
            description = `+${((upgrade.ammoMultiplier - 1) * 100).toFixed(0)}% ammo`;
        } else if (upgradeKey === 'RELOAD_SPEED') {
            description = `${((1 - upgrade.reloadTimeMultiplier) * 100).toFixed(0)}% faster`;
        } else if (upgradeKey === 'BLAST_RADIUS') {
            description = `+${((upgrade.radiusMultiplier - 1) * 100).toFixed(0)}% radius<br>+${((upgrade.explosiveDamageMultiplier - 1) * 100).toFixed(0)}% blast dmg`;
        }

        card.innerHTML = `
            <div style="font-weight: bold; color: #ffcc00; margin-bottom: 10px; font-size: 13px;">${upgrade.name}</div>
            <div style="font-size: 11px; color: #aaa; margin-bottom: 5px;">${description}</div>
            ${hasUpgrade ? '<div style="color: #00ff00;">✓ OWNED</div>' : `<div style="margin-top: 10px;">💰 ${upgrade.cost}</div>`}
        `;

        if (!hasUpgrade) {
            const buyButton = document.createElement('button');
            buyButton.textContent = 'BUY';
            buyButton.style.cssText = `
                background: ${this.player.coins >= upgrade.cost ? '#00cc00' : '#666'};
                border: 2px solid ${this.player.coins >= upgrade.cost ? '#00ff00' : '#888'};
                color: white;
                padding: 5px 15px;
                margin-top: 10px;
                cursor: ${this.player.coins >= upgrade.cost ? 'pointer' : 'not-allowed'};
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
            `;
            buyButton.onclick = () => this.buyUpgrade(upgradeKey, upgrade);
            card.appendChild(buyButton);
        }

        return card;
    }

    buyWeapon(weaponKey, weapon) {
        if (this.player.coins >= weapon.price) {
            this.player.coins -= weapon.price;
            if (!this.player.ownedWeapons) {
                this.player.ownedWeapons = ['PISTOL', 'KNIFE', 'SNIPER_RIFLE']; // Default weapons
            }
            this.player.ownedWeapons.push(weaponKey);

            // Notify server of weapon acquisition
            if (this.player.networkManager) {
                this.player.networkManager.notifyWeaponAcquired(weaponKey);
            }

            console.log(`Purchased ${weapon.name}!`);
            this.refresh();
        } else {
            console.log('Not enough coins!');
        }
    }

    equipWeapon(weaponKey) {
        this.player.switchWeapon(weaponKey);
        console.log(`Equipped ${WeaponTypes[weaponKey].name}!`);
        this.refresh();
    }

    buyUpgrade(upgradeKey, upgrade) {
        if (this.player.coins >= upgrade.cost) {
            this.player.coins -= upgrade.cost;
            if (!this.player.weaponUpgrades) {
                this.player.weaponUpgrades = {};
            }
            this.player.weaponUpgrades[upgradeKey] = true;
            this.player.applyUpgrades();
            console.log(`Purchased ${upgrade.name}!`);
            this.refresh();
        } else {
            console.log('Not enough coins!');
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}
