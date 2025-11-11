export const WeaponTypes = {
    SNIPER_RIFLE: {
        name: 'SNIPER RIFLE',
        damage: 80,
        fireRate: 1.0,
        maxAmmo: 10,
        reserveAmmo: 30,
        reloadTime: 2.5,
        price: 0, // Starting weapon
        hasExplosiveAmmo: false,
        explosiveRadius: 0,
        explosiveDamage: 0,
        scopeType: 'sniper',
        zoomedFOV: 0.2
    },

    ASSAULT_RIFLE: {
        name: 'ASSAULT RIFLE',
        damage: 30,
        fireRate: 0.1,
        maxAmmo: 30,
        reserveAmmo: 90,
        reloadTime: 2.0,
        price: 500,
        hasExplosiveAmmo: false,
        explosiveRadius: 0,
        explosiveDamage: 0,
        scopeType: 'rifle',
        zoomedFOV: 0.6
    },

    RPG: {
        name: 'RPG',
        damage: 50,
        fireRate: 2.0,
        maxAmmo: 1,
        reserveAmmo: 5,
        reloadTime: 3.0,
        price: 2000,
        hasExplosiveAmmo: true,
        explosiveRadius: 5,
        explosiveDamage: 150,
        scopeType: 'explosive',
        zoomedFOV: 0.7
    },

    HEAVY_SNIPER: {
        name: 'HEAVY SNIPER',
        damage: 120,
        fireRate: 1.5,
        maxAmmo: 5,
        reserveAmmo: 20,
        reloadTime: 3.0,
        price: 1500,
        hasExplosiveAmmo: false,
        explosiveRadius: 0,
        explosiveDamage: 0,
        scopeType: 'heavy',
        zoomedFOV: 0.25
    },

    EXPLOSIVE_RIFLE: {
        name: 'EXPLOSIVE RIFLE',
        damage: 40,
        fireRate: 0.3,
        maxAmmo: 20,
        reserveAmmo: 60,
        reloadTime: 2.5,
        price: 3000,
        hasExplosiveAmmo: true,
        explosiveRadius: 3,
        explosiveDamage: 80,
        scopeType: 'explosive',
        zoomedFOV: 0.5
    },

    MACHINE_GUN: {
        name: 'MACHINE GUN',
        damage: 20,
        fireRate: 0.05, // 20 rounds per second - very fast!
        maxAmmo: 100,
        reserveAmmo: 300,
        reloadTime: 4.0,
        price: 1000,
        hasExplosiveAmmo: false,
        explosiveRadius: 0,
        explosiveDamage: 0,
        scopeType: 'rifle',
        zoomedFOV: 0.7
    }
};

export const WeaponUpgrades = {
    DAMAGE: {
        name: 'Damage Upgrade',
        cost: 300,
        damageMultiplier: 1.5
    },
    FIRE_RATE: {
        name: 'Fire Rate Upgrade',
        cost: 400,
        fireRateMultiplier: 0.7 // Lower is faster
    },
    AMMO_CAPACITY: {
        name: 'Ammo Capacity Upgrade',
        cost: 250,
        ammoMultiplier: 1.5
    },
    RELOAD_SPEED: {
        name: 'Reload Speed Upgrade',
        cost: 200,
        reloadTimeMultiplier: 0.6
    }
};
