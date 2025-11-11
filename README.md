# Sniper Strike: Shadow Mission

A 3D tactical shooter game built with Babylon.js, inspired by Johnny Sniper.

## Features (Current Demo)

✅ **Core Gameplay**
- Third-person camera system
- Full 3D movement (WASD controls)
- Sprint, jump, and crouch mechanics
- Mouse-look camera control
- Collision detection

✅ **Combat System**
- Shooting mechanics with raycasting
- Ammo and reload system
- Enemy AI with patrol behavior
- Enemy detection and chase AI
- Health system for player and enemies

✅ **Level Design**
- Test environment with ground, obstacles, and cover
- Lighting system (ambient + directional)
- Simple skybox

✅ **UI/HUD**
- Health bar with color indicators
- Ammo counter
- Enemy counter
- Objective tracker
- Controls reference
- Weapon information

## Controls

- **WASD** - Move
- **Mouse** - Look/Aim
- **Left Click** - Shoot
- **R** - Reload
- **Shift** - Sprint
- **Space** - Jump
- **C** - Crouch (planned)

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server
npm run dev
```

The game will open automatically in your browser at `http://localhost:3000`

### Building for Production

```bash
# Build the game
npm run build

# Preview the build
npm run preview
```

## Project Structure

```
johnnysniper/
├── src/
│   ├── game/
│   │   ├── core/
│   │   │   └── InputManager.js      # Handles keyboard/mouse input
│   │   ├── entities/
│   │   │   ├── Player.js            # Player character controller
│   │   │   ├── Enemy.js             # Enemy AI and behavior
│   │   │   └── EnemyManager.js      # Enemy spawning and management
│   │   ├── level/
│   │   │   └── LevelManager.js      # Level creation and management
│   │   ├── ui/
│   │   │   └── UIManager.js         # HUD and UI updates
│   │   └── Game.js                  # Main game loop
│   └── main.js                      # Entry point
├── index.html                       # HTML template with HUD
├── package.json                     # Dependencies
└── vite.config.js                  # Vite configuration
```

## Technical Stack

- **Engine**: Babylon.js 6.0 (WebGL 2.0)
- **Physics**: Cannon.js (for future implementation)
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Current Implementation Status

### Completed ✅
- Project setup and build system
- Babylon.js engine integration
- Player movement and camera controls
- Shooting mechanics with raycasting
- Basic enemy AI (patrol, chase, attack states)
- Health and ammo systems
- Collision detection
- UI/HUD system
- Test level with obstacles

### In Progress 🚧
- Cover system
- Stealth mechanics
- Weapon variety
- Advanced enemy AI

### Planned 📋
- Multiple weapons with different stats
- Grenade throwing
- Mission objectives system
- More detailed 3D models
- Particle effects
- Sound effects and music
- Multiple levels
- Weapon upgrades
- Save system

## Performance

**Target Performance:**
- 60 FPS on desktop (mid-range hardware)
- WebGL 2.0 required
- Optimized for modern browsers (Chrome, Firefox, Edge, Safari)

**Current Status:**
- Basic scene runs at 60+ FPS
- Further optimization needed for larger levels

## Development Roadmap

### Phase 1 (Current)
- ✅ Core gameplay mechanics
- ✅ Basic AI
- ✅ UI system
- 🚧 Weapon system refinement

### Phase 2 (Next)
- Cover system implementation
- Stealth mechanics
- Multiple enemy types
- First complete mission

### Phase 3 (Future)
- Mission system
- Weapon upgrades
- Sound and music
- Enhanced graphics

## Known Issues

- Physics system not fully integrated (using basic collision)
- Camera can clip through walls
- No audio implementation yet
- Enemy AI is basic (will be enhanced)

## Contributing

This is a learning/demonstration project. Feel free to fork and experiment!

## Credits

- **Inspired by**: Johnny Sniper (Poki.com)
- **Engine**: Babylon.js
- **Created by**: Game Dev Team

## License

MIT License - See PRD.md for full product requirements document
