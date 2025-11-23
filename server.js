const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Game state
const players = new Map();
const bullets = [];
const lootDrops = new Map();
let lootIdCounter = 0;

// Player colors for different players
const playerColors = [
    { r: 1, g: 0, b: 0 },    // Red
    { r: 0, g: 0, b: 1 },    // Blue
    { r: 0, g: 1, b: 0 },    // Green
    { r: 1, g: 1, b: 0 },    // Yellow
    { r: 1, g: 0, b: 1 },    // Magenta
    { r: 0, g: 1, b: 1 },    // Cyan
    { r: 1, g: 0.5, b: 0 },  // Orange
    { r: 0.5, g: 0, b: 1 }   // Purple
];

let colorIndex = 0;

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Assign player data - spawn across larger 500x500 map
    const playerData = {
        id: socket.id,
        position: { x: Math.random() * 400 - 200, y: 0, z: Math.random() * 400 - 200 },
        rotation: { x: 0, y: 0, z: 0 },
        health: 100,
        color: playerColors[colorIndex % playerColors.length],
        username: `Player${players.size + 1}`,
        kills: 0,
        deaths: 0,
        isCrouching: false,
        weapons: ['PISTOL', 'KNIFE', 'SNIPER_RIFLE'],
        currentWeapon: 'PISTOL',
        coins: 0
    };
    colorIndex++;

    players.set(socket.id, playerData);

    // Send player their own data
    socket.emit('playerInit', {
        id: socket.id,
        ...playerData,
        players: Array.from(players.values()),
        lootDrops: Array.from(lootDrops.values())
    });

    // Notify other players of new player
    socket.broadcast.emit('playerJoined', playerData);

    // Handle player movement updates
    socket.on('playerUpdate', (data) => {
        const player = players.get(socket.id);
        if (player) {
            player.position = data.position;
            player.rotation = data.rotation;
            player.isCrouching = data.isCrouching || false;

            // Broadcast to other players
            socket.broadcast.emit('playerMoved', {
                id: socket.id,
                position: data.position,
                rotation: data.rotation,
                isCrouching: data.isCrouching
            });
        }
    });

    // Handle shooting
    socket.on('playerShoot', (data) => {
        const shooter = players.get(socket.id);
        if (!shooter) return;

        // Broadcast bullet to all players
        io.emit('bulletFired', {
            shooterId: socket.id,
            origin: data.origin,
            direction: data.direction,
            isExplosive: data.isExplosive || false
        });
    });

    // Handle hit detection (server-authoritative)
    socket.on('playerHit', (data) => {
        const target = players.get(data.targetId);
        const shooter = players.get(socket.id);

        if (target && shooter) {
            target.health -= data.damage;

            // Notify target they were hit
            io.to(data.targetId).emit('damaged', {
                damage: data.damage,
                health: target.health,
                shooterId: socket.id
            });

            // Check for kill
            if (target.health <= 0) {
                shooter.kills++;
                target.deaths++;

                // Create loot drop at victim's position
                const droppedWeapons = target.weapons.filter(w => w !== 'PISTOL' && w !== 'KNIFE');
                if (droppedWeapons.length > 0 || target.coins > 0) {
                    const lootId = 'loot_' + (lootIdCounter++);
                    const loot = {
                        id: lootId,
                        position: { ...target.position },
                        weapons: droppedWeapons,
                        coins: Math.floor(target.coins / 2), // Drop half their coins
                        droppedBy: target.username
                    };
                    lootDrops.set(lootId, loot);

                    // Notify all players of loot drop
                    io.emit('lootDropped', loot);

                    // Remove loot after 60 seconds
                    setTimeout(() => {
                        if (lootDrops.has(lootId)) {
                            lootDrops.delete(lootId);
                            io.emit('lootExpired', lootId);
                        }
                    }, 60000);
                }

                // Notify all players of the kill
                io.emit('playerKilled', {
                    killerId: socket.id,
                    killerName: shooter.username,
                    victimId: data.targetId,
                    victimName: target.username,
                    isHeadshot: data.isHeadshot || false
                });

                // Respawn the killed player after delay
                setTimeout(() => {
                    target.health = 100;
                    target.position = {
                        x: Math.random() * 400 - 200,
                        y: 0,
                        z: Math.random() * 400 - 200
                    };
                    // Reset to starting weapons
                    target.weapons = ['PISTOL', 'KNIFE', 'SNIPER_RIFLE'];
                    target.currentWeapon = 'PISTOL';
                    target.coins = 0;

                    io.to(data.targetId).emit('respawn', {
                        position: target.position,
                        health: target.health,
                        weapons: target.weapons,
                        coins: target.coins
                    });

                    io.emit('playerRespawned', {
                        id: data.targetId,
                        position: target.position
                    });
                }, 3000);
            }
        }
    });

    // Handle chat messages
    socket.on('chatMessage', (message) => {
        const player = players.get(socket.id);
        if (player) {
            io.emit('chatMessage', {
                playerId: socket.id,
                username: player.username,
                message: message
            });
        }
    });

    // Handle loot pickup
    socket.on('pickupLoot', (lootId) => {
        const player = players.get(socket.id);
        const loot = lootDrops.get(lootId);

        if (player && loot) {
            // Add weapons to player's inventory
            loot.weapons.forEach(weapon => {
                if (!player.weapons.includes(weapon)) {
                    player.weapons.push(weapon);
                }
            });

            // Add coins
            player.coins += loot.coins;

            // Remove loot from map
            lootDrops.delete(lootId);

            // Notify player of pickup
            socket.emit('lootPickedUp', {
                lootId: lootId,
                weapons: loot.weapons,
                coins: loot.coins,
                newInventory: player.weapons,
                totalCoins: player.coins
            });

            // Notify all players that loot was picked up
            io.emit('lootRemoved', lootId);
        }
    });

    // Handle weapon purchase/acquisition
    socket.on('weaponAcquired', (weaponKey) => {
        const player = players.get(socket.id);
        if (player && !player.weapons.includes(weaponKey)) {
            player.weapons.push(weaponKey);
        }
    });

    // Handle coin update
    socket.on('coinsUpdate', (coins) => {
        const player = players.get(socket.id);
        if (player) {
            player.coins = coins;
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        players.delete(socket.id);
        io.emit('playerLeft', socket.id);
    });
});

// Leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Array.from(players.values())
        .map(p => ({
            username: p.username,
            kills: p.kills,
            deaths: p.deaths,
            kd: p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : p.kills
        }))
        .sort((a, b) => b.kills - a.kills);

    res.json(leaderboard);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🎮 Sniper Strike PvP Server running on port ${PORT}`);
    console.log(`   Open http://localhost:${PORT} to play`);
});
