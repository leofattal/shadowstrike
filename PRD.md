# Product Requirements Document
# Sniper Strike: Shadow Mission

**Version:** 2.0
**Last Updated:** November 8, 2025
**Document Owner:** Game Development Team
**Project Type:** 3D Action Shooter Game

---

## 1. Overview

### 1.1 Game Concept
**Sniper Strike: Shadow Mission** is a 3D third-person tactical shooter that puts players in the boots of an elite sniper operative tasked with high-stakes missions across hostile territories. Inspired by Johnny Sniper's accessible gameplay combined with modern 3D tactical shooters, the game delivers precision shooting with immersive 3D environments and strategic depth.

### 1.2 What Makes It Fun and Unique
- **Precision Over Spray**: Unlike traditional run-and-gun shooters, success depends on accuracy, timing, and strategic positioning
- **3D Tactical Depth**: Full 360-degree movement and aiming with verticality (rooftops, towers, multi-story buildings)
- **Risk-Reward Stealth System**: Players can choose between loud tactical assaults or silent eliminations for bonus rewards
- **Dynamic Cover System**: Context-sensitive cover mechanics that work naturally with 3D environments
- **Progressive Mastery**: Each mission introduces new mechanics and challenges that build on previously learned skills
- **Satisfying Feedback Loop**: Clear visual and audio feedback for headshots, combos, and perfect stealth runs
- **Immersive 3D Environments**: Explore detailed 3D worlds with interactive elements and destructible objects

### 1.3 Target Audience
- Primary: Ages 13-35, action game enthusiasts
- Secondary: Casual browser gamers looking for engaging 3D experiences
- Skill Level: Accessible to beginners with depth for experienced players

### 1.4 Platform
- Web browser (HTML5/WebGL 2.0)
- Desktop-focused with mobile considerations
- Target: 60 FPS on mid-range hardware, 30 FPS on lower-end

---

## 2. Core Gameplay Loop

### 2.1 Mission Flow
```
Mission Select → Mission Briefing → Gameplay (Move/Aim/Shoot/Cover)
→ Complete Objectives → Mission Results/Score → Rewards/Upgrades
→ Shop/Loadout → Next Mission
```

### 2.2 In-Mission Loop
1. **Scout**: Observe enemy patterns and positions from vantage points
2. **Position**: Navigate 3D environments to reach strategic cover and high ground
3. **Engage**: Eliminate targets with precision shots, accounting for distance and bullet drop
4. **Adapt**: React to alerts, reinforcements, or changing objectives
5. **Complete**: Finish primary and optional objectives
6. **Extract**: Reach the extraction point (some missions)

### 2.3 Meta Progression Loop
- Earn currency and performance stars from missions
- Purchase weapon upgrades and equipment in the shop
- Unlock new weapons and abilities
- Replay missions for higher ranks and perfect scores
- Progress through increasingly difficult mission tiers

---

## 3. Game Mechanics

### 3.1 Player Controls

#### Desktop Controls
- **Movement**: WASD keys
- **Sprint**: Left Shift (hold)
- **Jump**: Spacebar
- **Crouch**: C or Ctrl
- **Prone**: Z (hold for tactical positioning)
- **Camera/Aim**: Mouse movement
- **Zoom/ADS (Aim Down Sights)**: Right Mouse Button (hold)
- **Shoot**: Left Mouse Button
- **Reload**: R
- **Switch Weapon**: Number keys 1-4 or Mouse Wheel
- **Throw Grenade**: G
- **Interact**: E (pick up items, rescue hostages, open doors)
- **Lean Left/Right**: Q/E (when in cover or ADS)
- **Toggle Camera View**: V (switch between third-person and over-the-shoulder)
- **Pause**: ESC

#### Mobile/Touch Controls (Simplified)
- **Virtual Joystick**: Left side (movement)
- **Look/Aim**: Right side drag
- **Sprint/Crouch Buttons**: Left side
- **Fire Button**: Right side
- **ADS Toggle**: Right side
- **Simplified control scheme with auto-cover and aim assist**

#### Gamepad Controls
- **Left Stick**: Movement
- **Right Stick**: Camera/Aim
- **L3 (Click)**: Sprint
- **R3 (Click)**: Melee
- **L2/LT**: Aim Down Sights
- **R2/RT**: Shoot
- **L1/LB**: Throw Grenade
- **R1/RB**: Switch Weapon
- **A/X**: Jump
- **B/Circle**: Crouch/Cover
- **X/Square**: Reload
- **Y/Triangle**: Interact
- **D-Pad**: Quick item selection

### 3.2 Movement Mechanics

#### Basic Movement
- **Walk Speed**: 4 m/s
- **Sprint Speed**: 7 m/s (drains stamina)
- **Crouch Speed**: 2 m/s
- **Prone Speed**: 1 m/s
- **Jump Height**: 1.5 meters
- **Climbing**: Auto-climb ledges up to 1.2 meters
- **Vaulting**: Vault over low obstacles (waist-height)

#### Advanced Movement
- **Stamina System**:
  - 100% stamina pool
  - Sprinting drains 10%/second
  - Regenerates 20%/second when not sprinting
  - Can't sprint below 10% stamina
- **Mantling**: Automatically climb up to elevated positions (boxes, walls, ledges)
- **Ladder Climbing**: Vertical movement at 2.5 m/s
- **Ziplines**: Fast traversal between points
- **Physics**: Realistic acceleration/deceleration, momentum affects accuracy

### 3.3 Camera System

#### Third-Person Camera
- **Default View**: Over-the-shoulder camera, offset to right
- **Camera Distance**: 2.5 meters behind player
- **Height Offset**: 0.5 meters above player shoulder
- **Dynamic FOV**: 75° standard, 60° when ADS
- **Camera Collision**: Smoothly moves closer when near walls
- **Auto-Rotation**: Gentle camera correction toward player facing direction

#### Aiming Modes
1. **Hip Fire**: Wide crosshair, lower accuracy, full movement speed
2. **ADS (Aim Down Sights)**: Zoom to weapon optic, high accuracy, 50% movement speed
3. **Sniper Scope**: Full zoom with scope overlay, maximum accuracy, minimal movement

#### Camera Options
- **Sensitivity**: Adjustable mouse/gamepad sensitivity (0.1x - 3.0x)
- **Invert Y-Axis**: Toggle option
- **Camera Shake**: Toggle for weapon recoil and explosions
- **FOV Slider**: 60° - 90° range

### 3.4 Shooting Mechanics

#### Aiming System
- **Crosshair**: Dynamic reticle that expands with movement and recoil
- **Bullet Physics**: Realistic ballistics with bullet drop over distance
  - Gravity: -9.8 m/s²
  - Sniper bullets affected at >50 meters
  - No bullet drop for pistols/SMGs at typical ranges
- **Damage Multipliers**:
  - Headshot: 3x damage, instant kill on most enemies
  - Chest/Torso: 1x damage
  - Arms: 0.7x damage
  - Legs: 0.6x damage
- **Accuracy Modifiers**:
  - Standing still: 100% accuracy
  - Walking: 80% accuracy
  - Sprinting: 40% accuracy
  - Jumping: 20% accuracy
  - Crouching: 110% accuracy
  - Prone: 125% accuracy
  - ADS: +50% accuracy bonus

#### Weapon Types and Stats

| Weapon | Damage | Fire Rate | Mag/Ammo | Reload | Range | Recoil |
|--------|--------|-----------|----------|--------|-------|--------|
| Sniper Rifle | 100 | Single | 5/25 | 3.0s | 200m | Low |
| Assault Rifle | 30 | 600 RPM | 30/180 | 2.2s | 75m | Medium |
| Pistol | 35 | Semi | 15/60 | 1.8s | 30m | Low |
| Shotgun | 15x8 pellets | Single | 8/32 | 2.5s | 15m | High |
| SMG | 22 | 800 RPM | 32/160 | 1.5s | 40m | Medium-High |
| Marksman Rifle | 65 | Semi | 10/50 | 2.5s | 150m | Medium |

#### Recoil System
- **Visual Recoil**: Camera kick on each shot
- **Pattern-Based**: Each weapon has predictable recoil pattern
- **Recovery**: Automatic recoil compensation after 0.5 seconds
- **Crouch/Prone**: Reduces recoil by 30%/50%
- **Attachments**: Can reduce recoil with compensators and grips

#### Reload System
- **Tactical Reload**: Faster reload when ammo remaining in mag (saves round)
- **Empty Reload**: Slower when magazine fully empty (chamber animation)
- **Reload Canceling**: Can cancel reload by switching weapons
- **Ammo Pool**: Reserve ammo shared, realistic magazine management

### 3.5 Cover and Stealth System

#### Dynamic Cover System
- **Auto-Cover**: Approach cover object and press crouch to snap into cover
- **Cover Types**:
  - **Full Cover**: Tall objects (walls, containers) - complete protection when crouched
  - **Half Cover**: Waist-high objects (barriers, crates) - partial protection
  - **Corner Cover**: Edge of walls - can peek around corners
- **Cover Actions**:
  - **Peek Over**: Aim over half-cover (exposing head/chest)
  - **Peek Left/Right**: Lean around corners (Q/E keys)
  - **Blind Fire**: Shoot without aiming (70% accuracy penalty)
  - **Cover-to-Cover**: Sprint between nearby cover points
- **Destructible Cover**:
  - Wooden crates: 150 HP, breaks into debris
  - Metal containers: 500 HP, shows bullet damage
  - Concrete barriers: 1000 HP, chips and cracks
  - Glass: Shatters immediately, provides concealment only
- **Cover Indicators**:
  - White outline when near available cover
  - Arrow indicators for movement between cover

#### Stealth System
- **Vision Cones**: Enemies have 3D vision cones (visible when crouched)
  - Front cone: 90° arc, 30 meter range
  - Peripheral: 180° arc, 15 meter range
  - Rear: Minimal 30° arc, 5 meter range
- **Detection States**:
  - **Undetected** (Green): Enemy unaware, full stealth
  - **Suspicious** (Yellow): Enemy investigating, detection at 30-70%
  - **Alerted** (Red): Enemy fully aware, combat initiated
  - **Search** (Orange): Lost sight, actively searching
- **Detection Factors**:
  - Distance to enemy (closer = faster detection)
  - Lighting (shadows reduce detection by 50%)
  - Stance (prone < crouch < standing)
  - Movement speed (still < slow < sprint)
  - Silhouette (behind cover vs. exposed)
- **Silent Takedowns**:
  - Approach from behind within 2 meters
  - Press melee button for instant elimination
  - No alert triggered
  - 3-second animation (vulnerable during)
- **Suppressed Weapons**:
  - 70% reduced audio range
  - Muzzle flash reduced
  - Enemies won't immediately alert others
  - Available as weapon attachment (unlockable)
- **Noise System**:
  - Footsteps: Audible within 8m (sprint), 3m (walk), 0m (crouch)
  - Gunshots: Alert radius 40m (unsuppressed), 15m (suppressed)
  - Explosions: Alert radius 60m
  - Distractions: Thrown objects, shot radios, alarms
- **Light and Shadow**:
  - Dynamic lighting affects visibility
  - Players can shoot out lights
  - Shadows provide concealment bonus
  - Night missions with flashlights/NVG
- **Body Awareness**:
  - Dead bodies remain visible
  - Enemies investigate bodies (5-second delay)
  - Can hide bodies (press E, 4-second animation)
  - Bodies in shadows less likely to be discovered
- **Stealth Bonus**:
  - +100% mission currency if zero alerts
  - +50% if one or fewer alerts

### 3.6 Equipment and Power-Ups

#### Grenades and Throwables (Limited Quantity)
- **Frag Grenade**:
  - 150 damage, 6-meter lethal radius, 10-meter damage falloff
  - 3-second fuse, can "cook" grenade before throwing
  - Arc trajectory indicator when aiming
- **Flashbang**:
  - Blinds and deafens for 6 seconds within 10-meter radius
  - Line-of-sight required for full effect
  - Facing away reduces effect by 80%
- **Smoke Grenade**:
  - Creates 8-meter smoke cloud lasting 15 seconds
  - Blocks enemy vision, disrupts targeting
  - Thermal scopes can see through smoke
- **C4 Explosive**:
  - Remote detonation
  - 200 damage, 8-meter radius
  - Can stick to surfaces
  - Used for breaching and traps
- **Decoy**:
  - Emits gunfire sounds
  - Attracts enemy attention for 10 seconds
  - Single-use distraction tool

#### Health and Armor System
- **Health**:
  - Maximum: 100 HP
  - No auto-regeneration (hardcore mode)
  - Health packs restore 50 HP
  - Can carry 2 health packs max
  - Medkits found in levels or pre-purchased
- **Armor System**:
  - Light Armor: +50 HP, no movement penalty
  - Heavy Armor: +100 HP, -10% movement speed
  - Absorbs damage before health
  - Doesn't regenerate during mission
- **Damage States**:
  - 100-70 HP: Healthy (no effects)
  - 69-40 HP: Injured (screen edges red tint, light breathing)
  - 39-15 HP: Critical (heavy red vignette, loud heartbeat, impaired vision)
  - <15 HP: Near death (black-and-white edges, severe screen shake)

#### Power-Ups (Temporary, Found In-Mission)
- **Bullet Time**:
  - 8 seconds of 40% slow-motion
  - Player moves at 70% speed, enemies at 40%
  - Perfect for precision shots
  - Cooldown: Once per mission or rechargeable at stations
- **Explosive Rounds**:
  - Next 10 shots deal AoE damage (3-meter radius, 50 damage)
  - Visual effect: Red glowing bullets
  - 30-second duration or until ammo used
- **Tactical Vision**:
  - Highlights enemies through walls (red silhouettes)
  - Shows enemy cone of vision
  - Lasts 15 seconds
  - Cooldown: 60 seconds
- **Adrenaline Rush**:
  - +50% movement speed
  - +50% reload speed
  - Instant stamina regeneration
  - Lasts 12 seconds
- **Damage Boost**:
  - 2x weapon damage
  - 20-second duration
  - Visual: Orange muzzle flash and hit markers

### 3.7 Enemy Types

#### Basic Enemies
1. **Soldier (Rifle)**:
   - Health: 80 HP
   - Weapon: Assault Rifle
   - Behavior: Patrols, uses cover, calls for backup
   - Accuracy: Medium (60%)
   - Detection: Standard vision cone

2. **Guard (Pistol)**:
   - Health: 60 HP
   - Weapon: Pistol
   - Behavior: Stationary or limited patrol, slower reactions
   - Accuracy: Low (40%)
   - Detection: Narrow vision cone

3. **Heavy Gunner (LMG)**:
   - Health: 150 HP
   - Weapon: Light Machine Gun (suppressive fire)
   - Behavior: Slow movement, heavy armor, stands ground
   - Accuracy: Medium (55%), high rate of fire
   - Special: Can't be killed by single headshot (needs 2)

4. **Scout (SMG)**:
   - Health: 70 HP
   - Weapon: SMG
   - Behavior: Fast movement, flanking tactics, aggressive
   - Accuracy: Medium at close range (65%)
   - Special: 2x sprint speed, climbs obstacles faster

#### Special Enemies
5. **Elite Sniper**:
   - Health: 80 HP
   - Weapon: Sniper Rifle (one-shot kill potential)
   - Behavior: Stationary, long-range, laser sight visible
   - Accuracy: Very High (90%)
   - Special: Must be eliminated quickly or from cover

6. **Grenadier**:
   - Health: 90 HP
   - Weapon: Assault Rifle + Grenades
   - Behavior: Throws grenades to flush out cover
   - Accuracy: Medium (60%)
   - Special: Throws grenades every 15 seconds

7. **Shield Trooper**:
   - Health: 100 HP (120 shield HP)
   - Weapon: Pistol + Ballistic Shield
   - Behavior: Advances slowly, frontal protection
   - Accuracy: Low (45%)
   - Special: Must shoot feet, sides, or use explosives

8. **Attack Dog**:
   - Health: 40 HP
   - Weapon: Melee (bite attack)
   - Behavior: Extremely fast, erratic movement, lunges
   - Special: Hard to hit, 50 damage melee attack, detects player by sound

#### Elite/Boss Enemies
9. **Combat Medic**:
   - Health: 85 HP
   - Weapon: Assault Rifle
   - Behavior: Revives downed allies (3-second channel)
   - Accuracy: Medium (60%)
   - Special: Priority target, can heal wounded enemies

10. **Drone Operator**:
    - Health: 70 HP
    - Weapon: Pistol + Surveillance Drone
    - Behavior: Deploys drone to scout areas
    - Special: Drone reveals player position, must destroy drone first

#### Boss Types
- **Mission 5 Boss: "The Mercenary"**:
  - Health: 800 HP + 200 Armor
  - Weapons: Dual SMGs, Grenade Belt
  - Abilities:
    - Grenade barrage (throws 3 grenades in succession)
    - Rapid repositioning (rolls between cover)
    - Calls 2 waves of reinforcements (4 soldiers each)
  - Phases:
    - Phase 1 (100-60%): Aggressive, advances
    - Phase 2 (60-30%): Defensive, uses grenades
    - Phase 3 (<30%): Berserk, dual-wields, rushes player
  - Weakness: Exposed during reload (5-second window every 30 seconds)

- **Mission 10 Boss: "The Commander"**:
  - Health: 1200 HP + 400 Armor
  - Weapons: Sniper Rifle, Attack Helicopter (scripted)
  - Abilities:
    - Precision sniper shots (one-shot kill if hit)
    - Helicopter support (strafing runs every 45 seconds)
    - Shield drones (3 drones absorb 200 HP each)
    - Tactical retreat (teleports to different vantage points)
  - Phases:
    - Phase 1: Sniper duel from watchtower
    - Phase 2: Helicopter support arrives, multiple positions
    - Phase 3: Final stand with shield drones
  - Weakness: Destroy power generators to disable shields, helicopter can be damaged

---

## 4. Level Design

### 4.1 Mission Structure

#### Mission Types
1. **Elimination**: Eliminate all enemy targets in the area
2. **Assassination**: Eliminate specific high-value target(s), optional stealth
3. **Rescue/Extraction**: Locate and extract hostages safely to extraction point
4. **Defense**: Survive waves while protecting an objective (ammo resupply between waves)
5. **Infiltration**: Reach extraction point, heavily rewards stealth
6. **Sabotage**: Destroy specific objectives (intel, equipment, vehicles)
7. **Recon**: Gather intelligence, take photos, avoid detection

#### Mission Progression Tiers
- **Tier 1 (Missions 1-3)**: Training Grounds - Tutorials and basic mechanics
- **Tier 2 (Missions 4-6)**: Urban Operations - Cover and stealth emphasis
- **Tier 3 (Missions 7-9)**: Hot Zones - Enemy variety and intensity
- **Tier 4 (Missions 10-12)**: Strongholds - Boss battles and complex objectives
- **Tier 5 (Missions 13+)**: Black Ops - Maximum difficulty, all mechanics combined

### 4.2 Environmental Themes

#### 1. Urban Rooftops
- **Setting**: Modern city skyline at dusk, neon-lit streets below
- **3D Features**:
  - Multi-level rooftops (2-4 accessible floors)
  - Ziplines between buildings
  - Climbable water towers and vents
  - Glass floors with destructible sections
  - Ledge-walking sections
- **Obstacles**: Air vents, satellite dishes, billboards, HVAC units
- **Cover**: AC units, brick walls, rooftop furniture, ventilation boxes
- **Hazards**: Fall damage from edges (instant death >20m), glass floors break under weight
- **Interactive**:
  - Rappel points for quick descent
  - Ziplines for traversal
  - Breakable skylights for infiltration
  - Shoot pigeon flocks for distraction

#### 2. War-Torn City Streets
- **Setting**: Destroyed urban environment, fires, collapsed buildings
- **3D Features**:
  - Rubble piles for elevation
  - Destroyed buildings with multiple floors (partial collapse)
  - Underground sections (basements, subway access)
  - Vehicle wrecks to navigate around/through
- **Obstacles**: Destroyed vehicles, barricades, debris, craters
- **Cover**: Concrete barriers, overturned cars, sandbag walls, building fragments
- **Hazards**:
  - Collapsing structures (triggered by explosions)
  - Fire patches (10 damage/second)
  - Unstable floors (can fall through)
- **Interactive**:
  - Car alarms (shoot to distract)
  - Explosive barrels (red, 100 damage, 5m radius)
  - Fuel tanks (trigger larger explosions)
  - Breach through damaged walls

#### 3. Military Base
- **Setting**: Fortified compound, searchlight towers, multiple buildings
- **3D Features**:
  - Guard towers (3 levels of height)
  - Multiple buildings (barracks, command center, armory)
  - Underground bunker sections
  - Perimeter wall with walkways
  - Helipad with helicopter
- **Obstacles**: Fences, guard posts, patrol routes, security checkpoints
- **Cover**: Shipping containers, concrete bunkers, military vehicles, walls
- **Hazards**:
  - Automated turrets (180° arc, 30m range, 15 damage/shot)
  - Minefield zones (instant kill, marked with signs)
  - Searchlights (reveal position if caught)
  - Laser grids (alarm triggers)
- **Interactive**:
  - Security cameras (shoot to disable, 10-second blackout)
  - Alarm systems (disable at control panels)
  - Gate controls (open alternative routes)
  - Computer terminals (gather intel, disable defenses)

#### 4. Industrial Complex
- **Setting**: Active factory/refinery, machinery, catwalks, warehouses
- **3D Features**:
  - Multi-level catwalks and platforms
  - Conveyor belt systems
  - Vertical shafts with ladders
  - Warehouse sections with high ceilings
  - Forklift-accessible areas
- **Obstacles**: Conveyor belts, machinery, steam vents, pipes, forklifts
- **Cover**: Metal crates, machinery, concrete pillars, industrial equipment
- **Hazards**:
  - Moving machinery (crush damage, 100 HP)
  - Steam vents (obstruct vision, 5 damage/second)
  - Electrical hazards (instant kill if touched)
  - Toxic spills (20 damage/second)
  - Hanging loads (can be shot to drop on enemies)
- **Interactive**:
  - Cranes (move containers to create new paths)
  - Control panels (stop/start machinery)
  - Steam valves (create smoke cover)
  - Forklift (vehicle, can drive for short distances)

#### 5. Mountain Outpost
- **Setting**: Snowy mountain installation, high altitude, extreme weather
- **3D Features**:
  - Multiple elevation levels (cliffs, plateaus)
  - Cave systems (limited visibility)
  - Cable car system for traversal
  - Observation posts on peaks
  - Indoor sections (heated bunkers)
- **Obstacles**: Rock formations, ice patches, wind gusts, snowdrifts
- **Cover**: Boulders, supply crates, vehicle wreckage, natural rock formations
- **Hazards**:
  - Fall damage (cliffs)
  - Avalanche zones (triggered by explosions, instant kill)
  - Icy surfaces (reduce traction, can slip)
  - Blizzard conditions (reduced visibility 50%)
  - Extreme cold (gradual damage if outside too long)
- **Interactive**:
  - Fuel tanks (explosive)
  - Communication towers (destroy objectives)
  - Cable cars (transportation)
  - Spotlights (shoot to disable)
  - Heating vents (safe zones from cold)

### 4.3 Level Design Principles

#### Pacing (10-15 minute missions)
- **Opening** (2 min): Safe approach zone, scouting opportunity, set the mood
- **Build-Up** (5 min): 2-3 combat encounters of increasing difficulty
- **Climax** (5 min): Major battle, boss encounter, or critical objective
- **Cool-Down** (2 min): Extraction, final sweep, mission complete sequence

#### Verticality and 3D Space
- **Multiple Elevation Levels**: Every map has at least 3 vertical layers
- **High Ground Advantage**: +20% accuracy, better sightlines, easier stealth
- **Vantage Points**: Sniper positions marked subtly in environment
- **Vertical Traversal**: Ladders, stairs, ziplines, rappel points, elevators
- **Fall Damage**:
  - <3 meters: No damage
  - 3-6 meters: 20 damage + brief stun
  - 6-10 meters: 50 damage + 2-second stun
  - >10 meters: 100 damage (death)

#### Player Agency and Multiple Paths
- **Approach Variety**:
  - Stealth Route: Shadows, vents, back entrances, longer but safer
  - Assault Route: Main entrance, direct confrontation, faster but dangerous
  - Tactical Route: Mixed approach, use distractions and positioning
- **Optional Objectives**:
  - Bonus objectives visible on map (intel gathering, VIP rescue)
  - Reward: Extra coins, unique weapon attachments, lore
- **Environmental Puzzles**:
  - Light (find fuse boxes to disable lights for stealth)
  - Medium (unlock gates using keycards from specific enemies)
  - Heavy (disable security systems via terminal hacking minigame)
- **Destructible Environments**:
  - Certain walls can be breached with C4
  - Floors can collapse under explosions
  - Create new sightlines by destroying obstacles

#### Environmental Storytelling
- **Contextual Clues**:
  - Documents and laptops with mission intel
  - Graffiti and posters showing faction conflict
  - Environmental damage showing recent battles
  - Radio chatter revealing enemy plans
- **Dynamic Events**:
  - Helicopter flyovers
  - Distant explosions and gunfire
  - Enemy patrols changing routes
  - Scripted conversations between guards
- **Visual Progression**:
  - Show consequences of previous missions
  - Enemy fortifications increase as threat level rises
  - Weather and time-of-day variations

#### Cover and Encounter Design
- **Cover Density**: Cover points every 5-8 meters in combat zones
- **Cover Flow**: Natural progression between cover positions
- **Flanking Opportunities**: Enemies can be outmaneuvered
- **Sightlines**: Clear firing lanes with risk/reward positioning
- **Enemy Placement**:
  - Mix of stationary and patrolling enemies
  - Overlapping patrol routes for stealth challenge
  - Sniper positions visible by scope glint
  - Ambush potential in narrow corridors

---

## 5. Art and Visual Style

### 5.1 Art Direction
**Style**: Semi-realistic 3D with stylized elements for clarity. Think modern military games (Splinter Cell, MGSV) but with more accessible, web-friendly graphics. Emphasis on clean silhouettes, strong lighting, and readable visual language.

**Visual Pillars**:
1. **Clarity**: Players can easily identify enemies, cover, and objectives
2. **Atmosphere**: Immersive 3D environments with strong mood
3. **Performance**: Optimized for web browsers without sacrificing quality
4. **Cohesion**: Unified art style across all assets

### 5.2 Graphics Technology

#### Rendering Engine
- **WebGL 2.0**: Modern 3D rendering in browser
- **PBR Materials**: Physically-Based Rendering for realistic materials
- **Real-time Lighting**:
  - Dynamic point lights (muzzle flashes, explosions)
  - Directional light (sun/moon)
  - Spot lights (flashlights, searchlights)
  - Up to 16 dynamic lights per scene
- **Shadows**:
  - Shadow mapping for main directional light
  - Soft shadows with PCF filtering
  - Optional: Character shadows from nearby lights
- **Post-Processing**:
  - Bloom (muzzle flashes, explosions)
  - Color grading (per-environment mood)
  - Screen-space ambient occlusion (SSAO) - optional
  - Motion blur - subtle, toggle-able
  - Depth of field - ADS mode only
  - Vignette - damage states

#### Graphics Settings (Scalable)
- **Low**:
  - 720p rendering
  - No shadows
  - Simplified materials
  - Minimal post-processing
  - 30 FPS target
- **Medium**:
  - 1080p rendering
  - Dynamic shadows (low res)
  - Standard PBR materials
  - Basic post-processing (bloom, color grade)
  - 45 FPS target
- **High**:
  - 1080p rendering
  - High-res shadows
  - Full PBR with normal maps
  - All post-processing effects
  - 60 FPS target
- **Ultra** (Desktop only):
  - 1440p+ rendering
  - High-res shadows with soft edges
  - Enhanced materials with parallax
  - SSAO enabled
  - 60 FPS target

### 5.3 3D Art Style

#### Polygon Budget
- **Player Character**: 15,000-20,000 triangles
- **Enemy Characters**: 8,000-12,000 triangles
- **Weapons (FP view)**: 5,000-8,000 triangles
- **Weapons (TP view)**: 2,000-3,000 triangles
- **Large Props**: 3,000-8,000 triangles
- **Medium Props**: 1,000-3,000 triangles
- **Small Props**: 200-1,000 triangles
- **Environment Modules**: 10,000-30,000 triangles per section

#### Texture Resolution
- **Characters**:
  - Main: 2048x2048 (diffuse, normal, roughness/metallic)
  - Weapons (FP): 1024x1024
  - Weapons (TP): 512x512
- **Environment**:
  - Tileable: 512x512 to 1024x1024
  - Unique props: 1024x1024 to 2048x2048
  - Terrain: 2048x2048 with tiling detail textures
- **UI Elements**: 512x512 to 1024x1024
- **Compression**: Optimized for web (WebP, compressed DDS, etc.)

### 5.4 Color Palette and Lighting

#### Overall Tone
- **Primary**: Muted military colors (olive greens, grays, browns, navy blues)
- **Accent**: High-contrast UI elements (red enemies, yellow objectives, blue friendlies)
- **Environment-Specific Color Grading**:
  - **Urban Rooftops**: Cool blues and purples (night), warm neon accents (signs, windows)
  - **War Zone**: Desaturated palette, orange/red fire glow, ash particles
  - **Military Base**: Harsh whites from searchlights, deep blue-black shadows, green accent lights
  - **Industrial**: Metallic grays and blues, yellow warning lights, orange sparks
  - **Mountain**: White and ice blue, harsh sunlight, long blue shadows

#### Time of Day Variations
- **Dawn**: Warm golden hour, long shadows, orange sky
- **Day**: Bright, clear visibility, blue sky, minimal shadows
- **Dusk**: Purple-orange gradient sky, medium shadows, dramatic lighting
- **Night**: Dark, limited visibility, rely on artificial lights and moon
- **Dynamic**: Some missions transition between times

### 5.5 Character Design

#### Player Character
- **Design**: Highly detailed tactical operator
  - Modular gear system (visible equipped items)
  - Helmet/mask options (customizable)
  - Tactical vest with pouches
  - Gloves, knee pads, boots
  - Weapon holsters visible on body
- **Customization**:
  - Body type (3 presets)
  - Gear color schemes
  - Camouflage patterns
  - Helmet/mask variations
- **Animations** (Full 3D rigging):
  - Idle variations (breathing, weapon check)
  - Locomotion blend tree (walk, jog, sprint in 8 directions)
  - Jump and land
  - Crouch and prone
  - Cover transitions
  - Weapon handling (draw, holster, reload per weapon)
  - Aiming layers (spine and arm IK)
  - Combat actions (shoot, throw, melee)
  - Hit reactions (front, back, left, right)
  - Death animations (ragdoll on death)
  - Contextual (climbing, vaulting, ledge grab)

#### Enemy Characters
- **Visual Hierarchy**: Clear distinction between types
  - **Guards**: Light armor, basic uniforms, patrol patterns
  - **Soldiers**: Medium armor, tactical gear, more aggressive
  - **Elites**: Heavy armor, unique silhouettes, special equipment
  - **Bosses**: Distinctive appearance, larger scale, unique gear
- **Faction Design**: Consistent visual language
  - Uniform color schemes
  - Logo/patch placement
  - Equipment style
- **Color Coding**:
  - Outfit base colors differentiate roles
  - Red UI markers appear when detected/targeted
  - Yellow when suspicious
- **State Indicators**:
  - Alert icon above head
  - Damaged state (visible wounds, limping)
  - Searching state (head movement, flashlight use)

### 5.6 Weapon Design

#### First-Person Weapon View (When ADS)
- **High Detail Models**:
  - Visible mechanical parts
  - Animated bolts, slides, hammers
  - Magazine insertion detail
  - Wear and scratches
- **Animations**:
  - Procedural recoil
  - Reload sequences (unique per weapon)
  - Inspect animations (idle)
  - Draw/holster
  - Tactical reload vs. empty reload

#### Third-Person Weapon View
- **Lower LOD**: Optimized mesh
- **Attached to Character**: Proper hand placement via IK
- **Visible When Holstered**: Show on back or hip

#### Weapon Attachments (Visible)
- **Optics**: Red dot, holographic, ACOG, sniper scopes
- **Barrel**: Suppressors, compensators, extended barrels
- **Underbarrel**: Foregrips, grenade launchers, lasers
- **Magazine**: Extended mags, fast mags (visual difference)
- **Stock**: Different stock types
- **Skin/Camo**: Customizable patterns and colors

### 5.7 Environment Art

#### Modular Level Building
- **Building Blocks**: Reusable modular pieces
  - Walls, floors, ceilings in various sizes
  - Corner pieces, doorways, windows
  - Stairs, railings, platforms
  - Props and details
- **Vertex Painting**: Add variation to modular pieces
- **Decals**: Bullet holes, blood, graffiti, posters
- **Trim Sheets**: Efficient texture use for architectural details

#### Environmental Details
- **Foliage**: Low-poly vegetation with alpha transparency (trees, bushes, grass)
- **Debris**: Scattered props for atmosphere (trash, rubble, papers)
- **Lighting Props**: Lamps, fluorescent lights, spotlights (actual light sources)
- **Interactive Highlights**: Subtle glow/outline for usable objects
- **Destruction States**: Intact → Damaged → Destroyed (3 stages for key objects)

#### Skybox and Background
- **Skybox**: 360° environment texture
  - Day/night variations
  - Weather states (clear, overcast, storm)
  - Dynamic clouds (scrolling texture)
- **Distant Scenery**:
  - Low-poly background buildings/mountains
  - Atmospheric perspective (fog distance)
  - Parallax for depth

### 5.8 Visual Effects (VFX)

#### Weapon Effects
- **Muzzle Flash**:
  - 3D light burst + sprite overlay
  - Different per weapon type
  - Illuminates nearby environment
- **Bullet Tracers**:
  - Fast-moving light trails (visible on heavy weapons)
  - Sniper tracers more prominent
  - Enemy tracers red, player tracers white/yellow
- **Impact Effects**:
  - Material-specific (sparks for metal, dust for concrete, splinters for wood)
  - Particle system + decal spawn
  - Dynamic lighting pulse
- **Shell Casings**:
  - Physics-simulated brass ejection
  - Bounce and settle
  - Disappear after 30 seconds (object pooling)

#### Explosion Effects
- **Grenade/C4**:
  - Expanding fireball (sphere)
  - Debris and smoke particles
  - Shockwave distortion
  - Camera shake
  - Dynamic light (bright orange pulse)
- **Environmental**:
  - Barrel explosions (larger, more debris)
  - Vehicle explosions (black smoke, metal chunks)

#### Environmental Effects
- **Weather**:
  - Rain (particle system, wet surfaces, puddles)
  - Snow (falling particles, accumulation on surfaces)
  - Fog (volumetric fog zones)
  - Wind (particle direction, foliage movement)
- **Lighting**:
  - Flickering lights (damaged areas)
  - Searchlight beams (volumetric)
  - Laser sights (beam + dot)
  - Flashlight cone (volumetric)
- **Particles**:
  - Smoke (fires, grenades, damaged equipment)
  - Dust (movement, impacts, destruction)
  - Embers (fires, explosions)
  - Steam (vents, industrial areas)
  - Sparks (electrical, metal impacts)

#### UI/Screen Effects
- **Hit Markers**:
  - 3D directional damage indicator (red arrow at screen edge)
  - Crosshair confirmation (hit marker X)
  - Headshot indicator (special icon + sound)
- **Damage Screen Effects**:
  - Blood splatter at edges (radial gradient)
  - Red vignette intensifies with low health
  - Desaturation when near death
  - Screen shake on damage
- **Slow-Motion**:
  - Bullet time color grading
  - Motion blur trails
  - Sound pitch adjustment
- **Stun Effects**:
  - Flashbang: White screen → blur → slow return
  - Explosion nearby: Muffled audio, screen shake, blur

---

## 6. Sound and Music

### 6.1 Overall Tone
**Immersive, tactical, and dynamic** - 3D spatial audio that enhances tactical awareness. Music adapts to gameplay state (stealth vs. combat). Realistic weapon sounds with environmental reverb.

### 6.2 3D Audio System

#### Spatial Audio
- **Positional Sound**: All sounds positioned in 3D space
- **Distance Attenuation**: Sounds fade with distance (realistic falloff curves)
- **Occlusion**: Muffled when objects/walls between source and listener
- **Reverb Zones**: Different acoustic spaces (indoor vs. outdoor, large vs. small rooms)
- **Doppler Effect**: Subtle pitch shift for fast-moving objects (rare, grenades/vehicles)

#### Audio Priorities
1. **Critical** (Always play):
   - Player weapon sounds
   - Incoming damage/alerts
   - Objective notifications
2. **High** (Priority mixing):
   - Nearby enemy sounds
   - Explosions
   - Important dialogue
3. **Medium** (Dynamic mixing):
   - Distant gunfire
   - Footsteps
   - Environmental ambience
4. **Low** (Can be culled):
   - Distant ambient sounds
   - Background effects

### 6.3 Music

#### Adaptive Music System
- **Layers**: Music has multiple layers that add/remove based on game state
  - Base layer: Ambient/atmospheric (always playing)
  - Tension layer: Adds when enemies suspicious
  - Combat layer: Full intensity during firefights
  - Victory layer: Mission complete flourish

#### Menu/Hub
- **Style**: Dark, atmospheric electronic with orchestral elements
- **Mood**: Professional, focused, preparing for battle
- **Tempo**: 85-95 BPM
- **Instrumentation**: Synth bass, strings, ambient pads, light percussion

#### Mission Briefing
- **Style**: Cinematic, dramatic
- **Mood**: Intelligence gathering, tension building
- **Tempo**: 70-80 BPM
- **Instrumentation**: Strings, piano, subtle electronics, building percussion

#### Gameplay - Stealth
- **Style**: Minimalist, suspenseful
- **Mood**: Cautious, high-stakes, holding breath
- **Tempo**: 60-70 BPM (slow heartbeat rhythm)
- **Instrumentation**: Sparse percussion, low drones, subtle strings, ambient noise
- **Dynamic**:
  - Detection 0-30%: Minimal, atmospheric only
  - Detection 31-70%: Tension layer kicks in (strings swell)
  - Detection 71-100%: Combat transition (percussion builds)

#### Gameplay - Combat
- **Style**: High-energy action, modern military
- **Mood**: Intense, adrenaline-fueled
- **Tempo**: 130-150 BPM
- **Instrumentation**: Heavy drums, distorted guitars, aggressive synths, brass stabs
- **Dynamic**:
  - Light combat (1-2 enemies): Moderate intensity
  - Heavy combat (3+ enemies): Full mix
  - Last enemy: Winds down
  - Combat ends: Quick fadeout to stealth music

#### Boss Battles
- **Style**: Epic hybrid orchestral
- **Mood**: Heroic struggle, climactic showdown
- **Tempo**: 100-120 BPM with dynamic tempo changes
- **Instrumentation**: Full orchestra, choir, electronic elements, heavy percussion
- **Phases**: Music changes with boss phases (different motifs)

#### Victory/Mission Complete
- **Style**: Triumphant, satisfying
- **Mood**: Accomplishment, relief
- **Duration**: 15-20 second musical sting
- **Instrumentation**: Brass fanfare, triumphant strings, percussion hit

### 6.4 Sound Effects

#### Weapons (3D Positioned)
- **Sniper Rifle**:
  - Sharp, echoing crack
  - Long reverb tail (realistic outdoor echo)
  - Heavy bass punch
  - Bolt-action mechanism sound
- **Assault Rifle**:
  - Rapid-fire mechanical bursts
  - Shell casing ejections (subtle clinks)
  - Magazine insertions/removals
- **Pistol**:
  - Crisp, punchy report
  - Slide action (chambering rounds)
  - Moderate bass
- **Shotgun**:
  - Deep, booming blast
  - Shell ejection (distinct sound)
  - Pump-action mechanism
- **SMG**:
  - Rapid, lighter report than AR
  - Higher pitch
  - Faster cadence
- **Suppressed Weapons**:
  - Muffled "phut" sound
  - Mechanical action louder than report
  - No echo
- **Grenade**:
  - Pin pull (metal clink)
  - Throw (whoosh)
  - Impact bounce (metal on surface)
  - Explosion (multi-layered: initial boom, debris, echo)
- **Reload Sounds**:
  - Unique per weapon
  - Magazine release
  - Magazine insertion
  - Bolt/slide action
  - Foley details (fabric, gear rattle)
- **Empty Chamber**: Dry click (immediate feedback)

#### Player Actions (First-Person)
- **Footsteps** (Material-based, 3D positioned):
  - Concrete: Hard, echoing steps
  - Metal: Ringing, metallic clangs
  - Wood: Creaky, hollow thuds
  - Gravel: Crunching, shifting rocks
  - Grass/Dirt: Soft rustling
  - Water: Splashing (depth-dependent)
  - Snow: Crunching, muffled
  - Speed-dependent: Walk (subtle), Sprint (loud), Crouch (minimal)
- **Jumping/Landing**:
  - Jump: Grunt (subtle)
  - Land: Impact thud + material sound
  - Hard landing (high drop): Louder grunt, longer recovery sound
- **Cover Actions**:
  - Enter cover: Slide/movement sound
  - Peek out: Fabric rustle
  - Leave cover: Quick movement sound
- **Climbing/Mantling**:
  - Hand grabs (surface-dependent)
  - Grunts (effort)
  - Gear rattle
- **Melee**:
  - Swing: Whoosh sound
  - Impact: Punch/thud (depends on hit/miss)
  - Knife takedown: Subtle stab sound + enemy gasp
- **Item Usage**:
  - Health pack: Medical zip, stim injection, relief exhale
  - Armor pickup: Vest equip, velcro straps
  - Ammo pickup: Magazine/shell box sounds
  - Grenade pickup: Metallic clink

#### Enemy Sounds (3D Positioned)
- **Alerts/Callouts** (Localized audio):
  - "Contact!"
  - "Enemy spotted!"
  - "Taking fire!"
  - "Man down!"
  - "Reloading!"
  - "Grenade out!"
  - "I need backup!"
  - Radio chatter (squad coordination)
- **Death Sounds**:
  - Impact grunt
  - Body fall (ragdoll impact sound)
  - Weapon drop (clatter)
- **Pain/Hit Reactions**:
  - Suppressed groans
  - Sharp intakes of breath
  - "I'm hit!"
- **Footsteps**:
  - Same material system as player
  - Audible to indicate patrol patterns
  - Can be tracked by sound
- **Search Mode**:
  - "Where did he go?"
  - "I heard something over there"
  - Flashlight click
  - Cautious footsteps

#### Environmental Ambience (3D Zones)
- **Urban**:
  - Distant traffic
  - City noise (sirens, horns)
  - Wind through buildings
  - Neon sign buzzing
- **War Zone**:
  - Distant explosions and gunfire
  - Crackling fires
  - Building creaks and settling
  - Emergency sirens
- **Military Base**:
  - Generator hum
  - Radio chatter (background)
  - Alarms (when triggered)
  - Patrol boots on pavement
  - Helicopter rotors (distant)
- **Industrial**:
  - Machinery operation (rhythmic)
  - Steam hissing
  - Metal clanging
  - Conveyor belt movement
  - Warning sirens/bells
- **Mountain**:
  - Howling wind
  - Snow/ice shifting
  - Distant avalanches
  - Creaking ice
  - Radio static
  - Heating system hum (indoors)

#### Interactive Object Sounds (3D Positioned)
- **Doors**:
  - Open/close (type-dependent: metal, wood)
  - Lock/unlock
  - Breach (kicked in, explosive)
- **Destructibles**:
  - Glass shatter (window types)
  - Wood splinter and break
  - Metal dent and collapse
  - Concrete crack and crumble
- **Alarms**:
  - Klaxon wails
  - Siren builds
  - Radio alert tones
- **Vehicles**:
  - Engine start/idle
  - Door open/close
  - Explosion (if destroyed)
- **Electronics**:
  - Computer terminal beeps
  - Security camera motor
  - Radio static and chatter

#### UI Sounds (2D, Non-spatial)
- **Menu Navigation**:
  - Hover: Subtle whoosh
  - Select: Crisp click
  - Back: Softer click
  - Invalid: Error beep
- **HUD Feedback**:
  - Objective update: Notification chime
  - Low ammo: Warning beep
  - Low health: Heartbeat (gets faster)
  - Reload complete: Soft confirmation
- **Purchases/Unlocks**:
  - Purchase: Cash register, success chime
  - Unlock: Achievement fanfare
  - Level up: Triumphant sting
- **Mission Events**:
  - Mission start: Dramatic hit
  - Objective complete: Positive chime
  - Mission complete: Victory fanfare
  - Mission failed: Negative tone

### 6.5 Voice Acting

#### Player Character (Optional, Minimal)
- Grunts and exertions (jumping, landing, melee)
- Pain reactions
- Optional tactical callouts (when solo)

#### Enemy NPCs
- Alert callouts
- Combat chatter
- Search dialogue
- Death sounds
- Radio communications

#### Support NPCs (Radio)
- Mission handler/control
- Briefing voiceover
- Mid-mission updates
- Extraction coordination

#### Localization
- English (primary)
- Spanish, French, German, Portuguese (subtitles initially)
- Full voiceover for future updates

### 6.6 Audio Accessibility
- **Visual Sound Indicators**:
  - Directional icons for footsteps
  - Gunfire direction indicators
  - Explosion proximity alerts
- **Subtitles**:
  - All dialogue
  - Important audio cues (e.g., "[Alarm triggered]", "[Enemy nearby]")
  - Speaker identification
- **Separate Volume Controls**:
  - Master volume
  - Music volume
  - SFX volume
  - Dialogue/Voice volume
  - UI sound volume
- **Mono Audio Option**: Combine stereo for accessibility
- **Audio Presets**: Headphones, Speakers, TV (different EQ curves)

---

## 7. UI/UX Design

### 7.1 Design Principles
- **Diegetic When Possible**: Integrate UI into 3D world where appropriate
- **Clarity**: Information hierarchy - critical info most prominent
- **Minimalism**: Clean HUD that doesn't obscure 3D gameplay
- **Responsiveness**: Immediate feedback for all interactions
- **Consistency**: Unified design language across all screens
- **Scalability**: UI scales with resolution and accessibility settings

### 7.2 HUD (Heads-Up Display)

#### Layout (16:9 Standard)
```
┌─────────────────────────────────────────────────────────┐
│ [HP: ████████░░ 80] [Armor: ████░░░░░░ 40]             │
│ [Ammo: 24/90]                              [Minimap]    │
│                                                         │
│                   [3D GAMEPLAY AREA]                    │
│                         [·]                             │
│                     (crosshair)                         │
│                                                         │
│ [Objective: Eliminate HVT]        [Detection: ░░░░]    │
│ [Grenade: 2] [Health Pack: 1]    [Score: 8,450]        │
└─────────────────────────────────────────────────────────┘
```

#### HUD Elements Details

**Top-Left Corner**
- **Health Bar**:
  - Segmented bar (green → yellow → red gradient)
  - Numeric display: "80/100"
  - Flashes red when damaged with directional damage indicator
  - Pulses when critical (<25 HP)
  - Regenerates edge-glow if armor equipped
- **Armor Bar**:
  - Blue segmented bar above health
  - Shows armor points
  - Separate from health visually
- **Ammo Counter** (Large, Clear):
  - Format: "Current Mag / Total Reserve"
  - Example: "24/90"
  - Different color per weapon type
  - Flashes yellow when <30% mag
  - Flashes red when empty
  - Infinity symbol for melee/unlimited

**Top-Right Corner**
- **Minimap** (3D Radar):
  - 2D top-down view of immediate area
  - Rotates with player camera
  - Shows:
    - Player position (blue arrow)
    - Enemies (red dots, cone shows facing)
    - Objectives (yellow markers)
    - Points of interest (white icons)
    - Terrain/walls (simple geometry)
  - Size: Adjustable (small/medium/large)
  - Zoom levels: Close (20m radius), Medium (40m), Far (60m)
  - Can be toggled off for immersion

**Top-Center**
- **Objective Tracker**:
  - Text: "Eliminate HVT (0/1)" or "Reach extraction point"
  - Progress bar for multi-step objectives
  - Distance marker: "250m" to next objective
  - Compass strip showing cardinal directions
  - Checkmarks for completed sub-objectives

**Bottom-Left**
- **Equipment Display**:
  - Grenade icon + count: "2"
  - Health pack icon + count: "1"
  - Active power-up with timer ring
  - Hotkey indicators (G, H, etc.)

**Bottom-Center**
- **Detection Meter**:
  - Eye icon that fills (green → yellow → red)
  - Visual representation of stealth status
  - Only appears when enemies nearby
- **Interaction Prompt**:
  - Contextual: "Press E to rescue hostage"
  - Icon + text
  - Fades in when near interactive object

**Bottom-Right**
- **Weapon Info**:
  - Current weapon icon + name
  - Fire mode indicator (auto/semi/burst)
  - Attachment icons (scope, suppressor, etc.)
- **Score/Combo**:
  - Current mission score
  - Kill combo multiplier: "x3 COMBO!"
  - Accuracy percentage (running total)

**Center Screen**
- **Crosshair** (Dynamic):
  - Expands with movement/recoil
  - Contracts when still/crouched
  - Changes color: White (default), Red (on enemy), Green (friendly)
  - Different style per weapon
  - Dot in center for precise aiming
- **Hit Markers**:
  - Crosshair confirmation (X shape flashes)
  - White (body hit)
  - Yellow (headshot)
  - Shield icon (armor hit)
  - Damage numbers optional (float upward from hit)
- **Damage Direction Indicator**:
  - Red arc/arrow at screen edge showing damage source direction
  - Fades after 1 second
- **Enemy Status Icons** (Above heads when aimed at):
  - Health bar (optional setting)
  - Alert status icon
  - Skull (low health/one-shot kill)

**Fullscreen Overlays**
- **Scope View** (When using sniper):
  - Circular scope overlay
  - Mil-dots or crosshair reticle
  - Range finder (distance to target)
  - Wind indicator (advanced mode)
  - Breath meter (hold breath to steady)
  - Black vignette around scope
  - Scope glint visible to enemies

### 7.3 Menu Screens (3D Backgrounds)

#### Main Menu
- **Background**: Slowly rotating 3D character model in hub environment
- **Layout**:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           SNIPER STRIKE: SHADOW MISSION                 │
│                [Animated 3D Logo]                       │
│                                                         │
│                   > START GAME                          │
│                     CONTINUE                            │
│                     MISSIONS                            │
│                     LOADOUT                             │
│                     ARMORY (SHOP)                       │
│                     SETTINGS                            │
│                     CREDITS                             │
│                     QUIT                                │
│                                                         │
│  [v2.0]  [Profile: Player1]  [Level: 15]  [Coins: 2.4K]│
└─────────────────────────────────────────────────────────┘
```

#### Mission Select Screen
- **Background**: 3D tactical map table with holographic mission markers
- **Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  [< BACK]           MISSION SELECT          Tier: 2/5   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  MISSION 1   │  │  MISSION 2   │  │  MISSION 3   │  │
│  │"First Strike"│  │"Urban Assault│  │  [LOCKED]    │  │
│  │              │  │              │  │              │  │
│  │[3D Preview]  │  │[3D Preview]  │  │ Requires:    │  │
│  │              │  │              │  │  5 stars     │  │
│  │  ★★★★★       │  │  ★★★☆☆       │  │              │  │
│  │  Score: 8450 │  │  Score: 7200 │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MISSION BRIEFING: "First Strike"                │  │
│  │  ────────────────────────────────────────────    │  │
│  │  Location: Training Compound (Day)               │  │
│  │  Type: Elimination                               │  │
│  │  Difficulty: ★☆☆☆☆                               │  │
│  │                                                  │  │
│  │  Objective:                                      │  │
│  │  - Eliminate all hostile forces                  │  │
│  │  - (Optional) Complete without alerts            │  │
│  │                                                  │  │
│  │  Rewards: 500 coins, Assault Rifle unlock       │  │
│  │                                                  │  │
│  │  [▶ PLAY MISSION]  [📋 VIEW INTEL]              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Loadout Screen
- **Background**: 3D weapon showcase with player character model
- **Interactive**: Rotate 3D weapon models, inspect attachments
```
┌─────────────────────────────────────────────────────────┐
│  [< BACK]             LOADOUT                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   PRIMARY:               SECONDARY:          MELEE:     │
│   ┌──────────────┐       ┌──────────────┐   [Knife]    │
│   │Sniper Rifle  │       │  Pistol      │              │
│   │[Rotate 3D]   │       │  [3D Model]  │              │
│   │              │       │              │              │
│   │Attachments:  │       │Attachments:  │              │
│   │☑ 8x Scope    │       │☑ Suppressor  │   THROWABLES:│
│   │☑ Suppressor  │       │☐ Laser       │   ┌────────┐ │
│   │☐ Ext. Mag   │       │              │   │ Frag x3│ │
│   │  [MODIFY]    │       │  [MODIFY]    │   │Flash x2│ │
│   └──────────────┘       └──────────────┘   └────────┘ │
│                                                         │
│   EQUIPMENT:              PERKS:                        │
│   ┌──────────────┐       ┌──────────────────────────┐  │
│   │Health Pack x2│       │ ⚡ Steady Aim (Tier 1)   │  │
│   │Armor Vest    │       │ 🛡️ Resilience (Tier 2)  │  │
│   │[SELECT]      │       │ 🔍 Scout (Tier 3)        │  │
│   └──────────────┘       │ [CHANGE PERKS]           │  │
│                          └──────────────────────────┘  │
│                                                         │
│                      [✓ CONFIRM LOADOUT]                │
└─────────────────────────────────────────────────────────┘
```

#### Armory/Shop Screen
- **Background**: 3D weapon vault, weapon racks visible
- **Interactive**: Full 3D weapon preview, rotate and inspect
```
┌─────────────────────────────────────────────────────────┐
│  [< BACK]            ARMORY              💰 Coins: 2,450│
├──────────────┬──────────────────────────────────────────┤
│  WEAPONS     │  ┌────────────────────────────────────┐  │
│  ATTACHMENTS │  │  ASSAULT RIFLE MK-II               │  │
│  EQUIPMENT   │  │  ────────────────────────────────  │  │
│  ARMOR       │  │  [Interactive 3D Model]            │  │
│  PERKS       │  │  [Click & drag to rotate]          │  │
│  COSMETICS   │  │                                    │  │
│              │  │  Stats:                            │  │
│              │  │  Damage: ████████░░ 80             │  │
│              │  │  Fire Rate: ███████░░░ 70          │  │
│              │  │  Accuracy: ██████░░░░ 60           │  │
│              │  │  Range: ███████░░░ 70              │  │
│              │  │  Recoil: ████░░░░░░ 40 (lower=better)│
│              │  │                                    │  │
│              │  │  Price: 💰 1,500 coins             │  │
│              │  │                                    │  │
│              │  │  [< PREV]  [PURCHASE]  [NEXT >]    │  │
│              │  │                                    │  │
│              │  │  Owned weapons: [Quick select]     │  │
│              │  └────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────┘
```

#### Mission Results Screen
- **Background**: 3D scene freeze-frame from mission end
- **Animated Stats**: Numbers count up, stars appear sequentially
```
┌─────────────────────────────────────────────────────────┐
│                  MISSION COMPLETE!                      │
│                                                         │
│              ★ ★ ★ ★ ☆  (4/5 STARS)                     │
│                 Rank: A                                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Combat Performance              Points            │ │
│  │  ─────────────────────────────────────────────    │ │
│  │  Enemies Eliminated: 24              2,400        │ │
│  │  Headshots: 12 (50%)                 1,200        │ │
│  │  Accuracy: 78%                         780        │ │
│  │                                                   │ │
│  │  Mission Performance                              │ │
│  │  ─────────────────────────────────────────────    │ │
│  │  Time: 8:34 / 10:00 (Fast!)            850        │ │
│  │  Stealth: 1 Alert (Good)               500        │ │
│  │  Objectives: 3/3                     1,500        │ │
│  │                                                   │ │
│  │  ─────────────────────────────────────────────    │ │
│  │  TOTAL SCORE:                        7,230        │ │
│  │  💰 Coins Earned:                      723        │ │
│  │  ⭐ XP Gained:                         450        │ │
│  │                                                   │ │
│  │  New Unlocks: [Assault Rifle Attachment]         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│      [RETRY]      [NEXT MISSION]      [MAIN MENU]      │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Pause Menu (In-Mission)
- **Background**: Blurred 3D game view
```
┌─────────────────────────────────────────────────────────┐
│                     ⏸ PAUSED                            │
│                                                         │
│                   > RESUME                              │
│                     RESTART CHECKPOINT                  │
│                     RESTART MISSION                     │
│                     SETTINGS                            │
│                     ABANDON MISSION                     │
│                                                         │
│  Mission: "First Strike"          Time: 05:23           │
│  Kills: 12  |  Accuracy: 82%  |  Alerts: 0              │
└─────────────────────────────────────────────────────────┘
```

### 7.5 Settings Screen

**Categories with Tabs**:

1. **Gameplay**:
   - Difficulty (Easy/Normal/Hard/Custom)
   - Aim assist (None/Low/Medium/High)
   - Auto-reload toggle
   - Crosshair customization
   - HUD opacity slider
   - Damage numbers toggle

2. **Controls**:
   - Input device (Keyboard/Gamepad/Touch)
   - Full key rebinding
   - Mouse sensitivity (separate for hip-fire and ADS)
   - Invert Y-axis
   - Toggle vs. hold (crouch, sprint, ADS)
   - Gamepad vibration intensity

3. **Graphics**:
   - Quality presets (Low/Medium/High/Ultra/Custom)
   - Resolution
   - V-Sync
   - Frame rate cap
   - FOV slider (60-90)
   - Shadow quality
   - Texture quality
   - Effects quality
   - Post-processing effects (individual toggles)

4. **Audio**:
   - Master volume
   - Music volume
   - SFX volume
   - Dialogue volume
   - UI sounds volume
   - Audio output (Stereo/Headphones/Mono)
   - Subtitles (On/Off, size adjustment)
   - Visual sound indicators

5. **Accessibility**:
   - Colorblind modes (None/Protanopia/Deuteranopia/Tritanopia)
   - UI scale (80%/100%/120%/150%)
   - High contrast mode
   - Screen reader support
   - Reduce motion effects
   - Hold button instead of tap (accessibility option)

### 7.6 Tutorials and Onboarding

#### First-Time Experience
1. **Welcome Cutscene**: Brief narrative setup (skippable)
2. **Training Mission** (Interactive tutorial):
   - **Phase 1**: Basic movement (WASD, sprint, jump, crouch)
   - **Phase 2**: Camera and aiming
   - **Phase 3**: Shooting and reloading
   - **Phase 4**: Cover system
   - **Phase 5**: Stealth basics
   - **Phase 6**: Equipment usage (grenade, health pack)
   - **Final Test**: Small combat scenario using all skills
3. **Post-Tutorial**:
   - Loadout explanation
   - Shop/currency system intro
   - Mission select overview

#### Contextual Tooltips (First-Time Only)
- On-screen prompts appear when new mechanic is available
- Examples:
  - "Hold Ctrl to crouch behind cover"
  - "Press E to perform silent takedown"
  - "Use Right Mouse to aim down sights for precision"
  - "Stay in shadows to reduce detection"
- Can be toggled in settings
- Skip option for experienced players

#### Advanced Tutorials (Optional)
- Unlocked after first 3 missions
- Cover topics like:
  - Advanced movement (vaulting, climbing)
  - Bullet drop and long-range sniping
  - Stealth mastery
  - Equipment combos

---

## 8. Monetization and Progression

*(This section remains largely the same as the 2D version, with minor adjustments for 3D-specific content)*

### 8.1 Monetization Model
**Free-to-Play with Ethical Monetization**
- Core game is completely free
- No pay-to-win mechanics
- Optional cosmetic purchases (3D weapon skins, character outfits)
- Optional ad viewing for bonuses

### 8.2 Currency System

#### Primary Currency: Coins
- **Earned through gameplay**:
  - Mission completion (200-1,500 coins based on performance and difficulty)
  - Star ratings (bonus 150 per star)
  - Achievements (one-time rewards: 100-800 coins)
  - Daily login (75-150 coins)
  - Daily/weekly challenges
- **Used for**:
  - Weapon purchases
  - Weapon upgrades and attachments
  - Equipment purchases
  - Consumables (health packs, grenades, armor)
  - Perks

#### Secondary Currency: Premium Tokens (Optional)
- **Acquired through**:
  - Real money purchase ($0.99 = 100 tokens)
  - Watching ads (15 tokens per ad, max 3/day)
  - Daily challenges (rare, 30-75 tokens)
  - Weekly challenges (50-100 tokens)
- **Used for**:
  - Exclusive 3D weapon skins (animated, particle effects)
  - Character cosmetics (outfits, helmets, gear)
  - Premium perks (XP boost, double coins for mission)
  - Unlock missions early (alternative to star requirements)
  - Special finisher animations

### 8.3 Progression Systems

*(Similar to 2D version with adjusted values)*

#### Experience and Player Level
- **XP Sources**:
  - Mission completion: 200-800 XP
  - Kills: 15 XP each
  - Headshots: +10 XP bonus
  - Stealth kills: +15 XP bonus
  - Objectives: 75-150 XP
  - Challenges: 100-500 XP
- **Level Benefits**:
  - Every 3 levels: Unlock new weapon/attachment
  - Every level: Coin bonus (75-150)
  - Levels 5, 10, 15, 20, 25, 30: Unlock special perks or equipment
  - Max level: 50 (with prestige system)

#### Star System
*(Same as 2D version)*

#### Achievement System
50+ achievements across categories:
- **Combat**: "Headhunter" (100 headshots), "Bulletproof" (Complete mission without damage), "Marksman" (90% accuracy mission)
- **Stealth**: "Ghost" (15 stealth missions), "Silent Assassin" (100 silent takedowns), "Invisible" (Mission with zero detections)
- **Collection**: "Arsenal" (Own all weapons), "Tactical Expert" (Max all weapon attachments)
- **Mastery**: "Perfectionist" (5 stars on all missions), "Speedrunner" (Complete all under par time), "Untouchable" (Complete tier without taking damage)
- **3D-Specific**: "Parkour Master" (100 vaults/climbs), "High Ground" (50 kills from elevated positions), "Vertical Assassin" (Kill from 3+ floors above)

### 8.4 Weapon and Equipment Progression

#### Weapon Unlock Path
1. **Tier 1 (Starting)**: Pistol, Basic Sniper Rifle
2. **Tier 2 (Levels 1-8)**: Assault Rifle, Shotgun, Frag Grenades
3. **Tier 3 (Levels 9-15)**: SMG, Advanced Sniper, Flashbangs, Smoke Grenades
4. **Tier 4 (Levels 16-25)**: Marksman Rifle, Combat Shotgun, C4, Decoys
5. **Tier 5 (Levels 26-35)**: Elite weapon variants with unique stats and models
6. **Tier 6 (Levels 36+)**: Experimental weapons (laser sights, smart tracking, etc.)

#### Weapon Upgrade System
Each weapon has 5 upgrade paths:
- **Damage**: +12% per level (5 levels max) - Cost: 300/600/900/1200/1500
- **Accuracy**: +10% per level (5 levels max) - Cost: 300/600/900/1200/1500
- **Range**: +15% per level (3 levels max) - Cost: 400/800/1200
- **Reload Speed**: -12% per level (4 levels max) - Cost: 350/700/1050/1400
- **Recoil Control**: -15% per level (4 levels max) - Cost: 350/700/1050/1400

#### Weapon Attachment System (Unlocked at Level 5)
- **Optics**:
  - Red Dot (faster ADS, close range)
  - Holographic (clear sight picture)
  - 4x ACOG (medium zoom)
  - 8x Scope (sniper zoom)
  - Thermal (see through smoke, highlight enemies)
- **Barrel**:
  - Suppressor (stealth, -10% range)
  - Compensator (-20% recoil)
  - Extended Barrel (+15% range)
- **Magazine**:
  - Extended Mag (+50% ammo capacity)
  - Fast Mag (+30% reload speed)
  - Hollow Point (+15% damage, -10% penetration)
- **Underbarrel**:
  - Foregrip (-15% recoil)
  - Laser Sight (+20% hip-fire accuracy, visible beam)
  - Bipod (deploy for +40% accuracy when prone)
- **Stock**:
  - Lightweight (+10% ADS speed)
  - Heavy (+15% recoil control, -5% movement speed)

Weapons can equip 1 attachment per category (max 5 total).

#### Perk System (Unlocked at Level 3)
Players can equip up to 3 perks (1 from each tier):

**Tier 1 - Offensive Perks**
- **Steady Aim**: +20% accuracy while moving
- **Dead Eye**: +30% headshot damage
- **Fast Hands**: +40% reload speed
- **Stopping Power**: +15% overall weapon damage

**Tier 2 - Defensive Perks**
- **Resilience**: +25% max health
- **Tactical Armor**: Start missions with 75 armor
- **Second Wind**: Heal 40 HP on kill when below 25 HP
- **Marathon**: +30% sprint duration

**Tier 3 - Utility Perks**
- **Scout**: Enemies glow red when ADS for 3 seconds
- **Ninja**: -70% footstep noise, +2 second stealth grace period
- **Resourceful**: +2 grenades on spawn, ammo boxes give +50% ammo
- **Tactical Vision**: Start with one free Tactical Vision power-up

### 8.5 Daily and Weekly Challenges

#### Daily Challenges (3 per day, resets every 24 hours)
Rewards: 150 coins + 25 tokens
- Examples:
  - "Complete any mission with >85% accuracy"
  - "Eliminate 40 enemies with headshots"
  - "Complete 2 missions without using health packs"
  - "Get 15 kills from elevated positions"
  - "Perform 10 silent takedowns"

#### Weekly Challenges (3 major, resets every 7 days)
Rewards: 800 coins + 75 tokens + exclusive cosmetic
- Examples:
  - "Earn 20 stars this week"
  - "Complete all Tier 2 missions with perfect stealth"
  - "Deal 15,000 total damage"
  - "Win 5 missions using only pistol as primary"
  - "Complete 10 missions without dying"

### 8.6 Cosmetic System (Optional, Premium & Free)

#### Character Customization
- **Outfits** (Full body):
  - Default: Black Ops Operative (free)
  - Unlockable (coins): Urban Camo (750), Desert Spec Ops (1,200), Arctic Recon (1,800), Forest Ranger (1,500)
  - Premium (tokens): Cyber Soldier (250), Shadow Assassin (300), Golden Elite (500)
- **Helmets/Headgear**:
  - Tactical helmets, balaclavas, gas masks, night vision goggles
  - Mix and match with outfits
- **Gear Color**:
  - Vest color
  - Glove color
  - Boot color

#### Weapon Skins (3D Models)
- **Rarity Tiers**:
  - **Common** (coins 200-500): Solid colors, basic camo patterns
  - **Rare** (coins 800-1200 or tokens 50-100): Unique textures, special patterns, metallic finishes
  - **Epic** (tokens 150-250): Animated textures, particle effects (glow, sparks), reactive (changes with kills)
  - **Legendary** (tokens 300-500): Complete custom 3D models, unique animations, kill effects, sound effects

#### Finishing Moves (Melee Kills)
- Default: Quick knife stab
- Unlockable:
  - Neck snap (500 coins)
  - Throat slice (800 coins)
  - Takedown + disarm (premium, 200 tokens)

#### UI Themes
- Unlock alternative HUD color schemes and styles
- Crosshair packs
- Hit marker variations

### 8.7 Replayability Features

#### New Game Plus
- Unlocked after completing all Tier 1-4 missions
- Enemy stats: 2.5x health, 1.8x damage
- Player limitation: No minimap, limited HUD
- Rewards: 3x coins and XP, exclusive NG+ weapon skins

#### Mission Modifiers (Unlocked at Level 12)
- **One in the Chamber**: Start with 1 bullet per weapon, must scavenge (reward: +150% coins)
- **Hardcore**: 1 HP, no HUD, no detection meter (reward: +200% coins)
- **Time Attack**: Complete mission <5 minutes (reward: +100% coins)
- **Pacifist Run**: Complete without killing non-targets (reward: +150% XP)
- **Rampage**: Infinite ammo, fast reload (reward: -50% coins, for fun)

#### Leaderboards
- Global and friend leaderboards per mission
- Categories:
  - Fastest completion time
  - Highest score
  - Highest accuracy
  - Most headshots
  - Perfect stealth runs
- Weekly "Featured Mission" with rotating challenges
- Top 100 players get exclusive badge and cosmetic

---

## 9. Technical Requirements

### 9.1 Platform Specifications

#### Target Platform
- **Primary**: Web Browser (Desktop)
- **Secondary**: Web Browser (Mobile - simplified)
- **Technology**: WebGL 2.0 with fallback to WebGL 1.0
- **Game Engine**: Three.js, Babylon.js, or PlayCanvas (recommended 3D web engines)

#### Browser Compatibility
- **Desktop (Minimum)**:
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Safari 15+
  - Edge 90+
  - Opera 76+
- **Mobile Browsers** (Experimental/Simplified):
  - Chrome Mobile (Android 10+)
  - Safari Mobile (iOS 15+)
- **WebGL 2.0 Required**: For advanced graphics features

### 9.2 Performance Targets

#### Desktop (Primary Focus)
- **Resolution**:
  - Native: 1920x1080
  - Supported: 1280x720 to 3840x2160 (4K)
  - Windowed and fullscreen modes
- **Frame Rate**:
  - High settings: 60 FPS constant (mid-to-high-end GPUs)
  - Medium settings: 45-60 FPS (mid-range GPUs)
  - Low settings: 30-45 FPS (integrated graphics)
- **Load Time**:
  - Initial load: <15 seconds (with loading screen)
  - Mission load: <5 seconds
  - Asset streaming: Minimal stuttering
- **Memory Usage**:
  - <1.5 GB RAM (browser process)
  - <800 MB VRAM (GPU)

#### Mobile (Simplified Version)
- **Resolution**:
  - 1280x720 adaptive
  - Render scale: 70-100% based on device
- **Frame Rate**:
  - Target: 30 FPS stable
  - Acceptable: 25+ FPS
- **Load Time**:
  - Initial: <20 seconds
  - Mission: <8 seconds
- **Memory Usage**:
  - <800 MB RAM
  - Aggressive asset culling
- **Battery**:
  - <20% drain per 30-minute session
  - Thermal throttling mitigation

### 9.3 Technical Architecture

#### Core Systems
1. **Game Loop**:
   - Fixed timestep physics: 60 updates/sec
   - Variable render rate (uncapped or capped)
   - Delta time interpolation

2. **3D Rendering Pipeline**:
   - Forward rendering (WebGL 2.0)
   - Frustum culling (don't render off-screen objects)
   - Occlusion culling (basic, optional)
   - LOD system (3 detail levels: high, medium, low)
   - Instanced rendering for repeated objects
   - Batched draw calls (minimize state changes)

3. **Physics**:
   - Lightweight physics library (Cannon.js or Ammo.js)
   - Player collision (capsule vs. world geometry)
   - Ragdoll physics for deaths
   - Projectile physics (raycasts for bullets, physics for grenades)
   - Destructible object physics

4. **AI System**:
   - Finite State Machine for enemy behavior
   - Navigation mesh (NavMesh) for pathfinding
   - Vision cone calculations (raycasting)
   - Hearing simulation (distance-based)
   - Squad coordination (basic)

5. **Audio**:
   - Web Audio API (3D positional audio)
   - Fallback to HTML5 Audio (non-spatial)
   - Audio pooling (reuse sources)
   - Dynamic mixing based on priority

6. **Input**:
   - Unified input manager (keyboard, mouse, touch, gamepad)
   - Input buffering for responsiveness
   - Pointer lock for FPS-style camera

7. **State Management**:
   - Finite State Machine for game states (menu, loading, gameplay, pause, results)
   - Scene management (unload/load 3D scenes)

#### Data Management
- **Save System**:
  - LocalStorage for web (JSON serialization)
  - IndexedDB for larger save data
  - Cloud save (optional, requires account via backend API)
  - Auto-save: After each mission, every checkpoint
  - Manual save: 3 slots
- **Asset Loading**:
  - Progressive/streaming asset loading
  - Priority queue:
    1. Critical: UI, player model, basic weapons
    2. High: Current mission environment, enemies
    3. Medium: Audio, VFX
    4. Low: Future mission previews, cosmetics
  - Asset compression (GZIP, Draco for 3D models, KTX for textures)
- **Configuration Files** (JSON):
  - Weapon stats and balancing
  - Enemy types and AI parameters
  - Mission data (objectives, spawn points, layout references)
  - Upgrade costs and progression curves
  - All tweakable without code changes

### 9.4 Asset Specifications

#### 3D Models
- **Format**:
  - glTF 2.0 (.glb binary) - Primary
  - FBX (converted to glTF in pipeline)
- **Compression**:
  - Draco compression for geometry
  - Quantized vertex positions
- **Polygon Budgets**: (See section 5.3)
- **LOD Levels**:
  - LOD0 (High): Full detail, <10m from camera
  - LOD1 (Medium): 60% triangles, 10-30m from camera
  - LOD2 (Low): 30% triangles, >30m from camera

#### Textures
- **Format**:
  - Compressed: KTX2 with Basis Universal (best compression for web)
  - Fallback: PNG (for compatibility)
- **PBR Texture Maps**:
  - Base Color (Albedo)
  - Normal Map
  - Metallic/Roughness (combined in single texture: R=metallic, G=roughness)
  - Ambient Occlusion (optional, can be baked)
  - Emissive (for glowing elements)
- **Resolutions**: (See section 5.3)
- **Mipmaps**: Auto-generated for all textures
- **Tiling**: Environment textures tile seamlessly

#### Audio
- **Format**:
  - Music: MP3 (web standard, best compatibility)
  - SFX: MP3 or OGG (fallback)
  - Spatial audio: Mono sources (positioned in 3D)
  - Stereo: Music and ambient loops only
- **Bitrate**:
  - Music: 128-160 kbps
  - SFX: 96-128 kbps
- **Sample Rate**: 44.1 kHz
- **Compression**: Balanced for quality vs. file size
- **Audio Budget**:
  - Max simultaneous sources: 32
  - Pooled and reused

#### Animations
- **Format**: Embedded in glTF files
- **Rigging**:
  - Player: 50-70 bones (full body IK rig)
  - Enemies: 40-50 bones
  - Weapons: 5-10 bones (optional, for animated parts)
- **Animation Compression**: Quantized keyframes
- **Blending**: Blend trees for smooth transitions

#### Shaders
- **Materials**:
  - PBR Standard Shader (most objects)
  - Unlit Shader (UI, some effects)
  - Custom Shaders:
    - Scope shader (vignette, zoom)
    - Water shader (reflections, animated normals)
    - Glass shader (transparency, refraction)
    - Hologram shader (UI elements, futuristic)
- **Shader Complexity**: Keep fragment shader ops minimal for performance

#### Total Asset Budget
- **Initial Download**:
  - <50 MB (compressed core game + first mission)
  - Loads in background: Additional missions, cosmetics
- **Per Mission**:
  - <15 MB (environment, mission-specific assets)
  - Streamed as needed
- **Total Game** (All content):
  - <300 MB (12 missions, all weapons, cosmetics)
- **Aggressive Caching**: Cache assets in browser storage

### 9.5 Optimization Strategies

#### Rendering Optimizations
- **Object Pooling**: Reuse game objects (bullets, particles, enemies, debris)
- **Frustum Culling**: Don't render objects outside camera view (built into engine)
- **Occlusion Culling**: Basic room-based occlusion (optional)
- **LOD System**: Automatic LOD switching based on distance
- **Draw Call Batching**:
  - Combine meshes with same material
  - Use instanced rendering for repeated objects (trees, props)
  - Texture atlases to reduce material count
- **Particle Limits**:
  - Max particles: 2000 active (culled by distance and priority)
  - Use sprite particles over mesh particles
- **Shadow Optimizations**:
  - Single cascaded shadow map for main light
  - Limit shadow-casting objects
  - Lower shadow resolution on low settings
- **Post-Processing**:
  - Render to lower resolution for some effects
  - Toggle-able effects for performance

#### Memory Optimizations
- **Asset Unloading**:
  - Unload previous mission assets when loading new mission
  - Keep only current mission, UI, and player assets in memory
- **Texture Streaming**:
  - Load high-res textures only when needed
  - Use lower-res placeholders during load
- **Garbage Collection**:
  - Manual cleanup of unused objects
  - Minimize object creation in game loop
- **Audio Streaming**:
  - Stream music files (don't load entirely)
  - Preload frequently used SFX

#### Network Optimizations (for online features)
- **Asset CDN**: Serve all assets from CDN (global distribution)
- **Compression**: GZIP/Brotli compression for all text/JSON
- **Caching**:
  - Aggressive browser caching (versioned assets)
  - Service Worker for offline capability (optional)
- **API Calls**:
  - Minimize server requests
  - Batch multiple requests when possible
  - Use WebSockets for real-time features (leaderboards, ghost runs)

#### Code Optimizations
- **Minification**: Minify all JavaScript code
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Load code modules as needed (lazy loading)
- **Web Workers**:
  - Offload heavy computations (pathfinding, physics) to workers
  - Keep main thread responsive

### 9.6 Accessibility Requirements

#### Visual Accessibility
- **Colorblind Modes**:
  - Protanopia (red-blind): Adjust enemy markers (red → orange/purple)
  - Deuteranopia (green-blind): Adjust friendlies and UI
  - Tritanopia (blue-blind): Adjust entire color palette
  - High contrast mode (increased saturation and contrast)
- **Contrast**: WCAG AA compliant (4.5:1 for text, 3:1 for UI elements)
- **UI Scaling**: 80%, 100%, 120%, 150% (adjustable)
- **Subtitle Support**:
  - All dialogue
  - Important audio cues
  - Speaker identification
  - Adjustable size and background opacity
- **Visual Sound Indicators**:
  - Directional icons for footsteps, gunfire, explosions
  - Always visible or toggle-able

#### Audio Accessibility
- **Mono Audio**: Combine stereo channels for single-ear hearing
- **Individual Volume Controls**: Master, Music, SFX, Dialogue, UI
- **Visual Alternatives**: Icons for all critical audio cues
- **Closed Captions**: More detailed than subtitles (includes [Alarm blaring], [Footsteps approaching], etc.)

#### Input Accessibility
- **Remappable Controls**: Every key/button can be rebound
- **Mouse Sensitivity**: 0.1x to 5.0x range (fine-grained)
- **Separate ADS Sensitivity**: Different sensitivity when aiming
- **Toggle Options**:
  - Toggle crouch (instead of hold)
  - Toggle sprint
  - Toggle ADS
  - Toggle lean
- **Gamepad Support**:
  - Full Xbox/PlayStation/generic controller support
  - Adjustable dead zones
  - Button remapping
  - Vibration intensity slider
- **One-Handed Mode**:
  - Remap all actions to one side of keyboard
  - Mouse-only control option (all actions via mouse buttons + modifiers)

#### Gameplay Accessibility
- **Difficulty Settings**:
  - Easy: 2x player health, 0.5x enemy damage, slower enemies
  - Normal: Default balanced
  - Hard: 0.8x player health, 1.5x enemy damage, smarter AI
  - Custom: Adjust individual parameters (enemy health, damage, AI, detection speed)
- **Aim Assist**:
  - None (disabled)
  - Low (subtle snap-to-target)
  - Medium (moderate snap + slowdown)
  - High (strong snap, larger target zones)
  - Mobile: High by default
- **Auto-Aim**: Optional full auto-targeting for severe motor impairments
- **Checkpoint System**: Frequent checkpoints to minimize replay on death
- **Pause Anytime**: Even during combat
- **Slow-Motion Mode**: Optional permanent slow-motion (accessibility feature, not power-up)

### 9.7 Security and Anti-Cheat

#### Client-Side Protection
- **Code Obfuscation**: Obfuscate JavaScript to deter basic tampering
- **Score Validation**:
  - Server-side verification of mission results
  - Plausibility checks (impossible scores flagged)
  - Hash mission data to prevent local manipulation
- **Save File Integrity**:
  - Checksums/signatures on save data
  - Server validation for cloud saves
- **Input Validation**:
  - Sanitize all user inputs
  - Rate limiting on actions
  - Prevent injection attacks

#### Server-Side (for online features)
- **Leaderboard Verification**:
  - Replay data storage (optional, for top scores)
  - Statistical outlier detection (flag suspicious scores)
  - Manual review for top 100
  - Report system for cheaters
- **Rate Limiting**:
  - Limit API requests per user/IP
  - Prevent spam and abuse
  - DDoS mitigation
- **Encryption**:
  - HTTPS for all communications
  - JWT tokens for authentication
  - Encrypted save data in transit
- **Anti-Bot**:
  - CAPTCHA for account creation
  - Behavioral analysis (detect bot patterns)

### 9.8 Analytics and Telemetry

#### Tracked Metrics (Privacy-Conscious, Anonymized)
- **Player Progression**:
  - Mission completion rates (per mission)
  - Average star ratings
  - Time spent per mission
  - Player level distribution
  - Weapon usage statistics
  - Unlock progression
- **Engagement**:
  - Session duration (average, median)
  - Sessions per user
  - Retention (D1, D7, D30)
  - Mission replay rates
  - Feature usage (shop visits, loadout changes)
- **Economy**:
  - Currency earned vs. spent
  - Popular purchases (weapons, attachments, cosmetics)
  - Conversion rates (free to premium)
  - Daily/weekly challenge completion
- **Performance**:
  - Average FPS (per hardware tier)
  - Load times (initial, per mission)
  - Crash/error rates
  - Graphics settings distribution
  - Browser/OS breakdown
- **Gameplay Balance**:
  - Weapon balance (kill rates, popularity)
  - Mission difficulty (death rates, average attempts)
  - Enemy types (which are most/least challenging)
  - Perk usage and effectiveness

#### Privacy Compliance
- **No PII Collection**: No personally identifiable information collected
- **Anonymized Data**: All analytics are aggregate and anonymized
- **Opt-Out**: Users can disable telemetry in settings (still fully functional)
- **GDPR/CCPA Compliant**:
  - Clear privacy policy
  - Data deletion requests honored
  - Cookie consent (required for EU)
- **Transparent**: Users informed what data is collected and why

---

## 10. Future Features and Roadmap

### 10.1 Phase 1 (Launch - Month 3)

#### Core Content Expansion
- **New Mission Pack**: 6 additional missions (Tier 6 - "Legendary Operations")
  - New environment: Jungle warfare (dense vegetation, rivers, ruins)
  - New environment: Underground bunker complex
  - New enemy types: Flamethrower units, armored vehicles (light tanks)
  - New boss: "The Ghost" (stealth-focused rival sniper)

- **Weapon Expansion**:
  - Crossbow (silent, high damage, reusable bolts, limited ammo)
  - Tactical Shield (defensive weapon, can bash enemies)
  - Light Machine Gun (suppressive fire, bipod deploy)
  - Grenade Launcher (underbarrel or standalone)

- **Quality of Life**:
  - Mid-mission checkpoints (manual save points)
  - Practice Range (hub area to test weapons, attachments, and practice aim)
  - Photo Mode (pause game, free camera, filters, share screenshots)
  - Replay System (watch mission replays, free cam)
  - Statistics Page (detailed personal stats)

### 10.2 Phase 2 (Month 4-6)

#### Competitive Features
- **Daily Operations**:
  - Procedurally generated missions using modular level pieces
  - Random enemy placements and patrol patterns
  - Randomized objectives (eliminate X enemies, reach point Y, etc.)
  - Daily leaderboard (resets every 24 hours)
  - Exclusive rewards for top 10%

- **Challenge Mode**:
  - **Survival Mode**: Endless waves, increasing difficulty, see how long you last
  - **Time Attack**: Complete missions as fast as possible
  - **Accuracy Trials**: Hit moving targets, score based on accuracy
  - **Stealth Trials**: Complete without being detected, score based on speed
  - Global and friend leaderboards for each mode

- **Clan/Team System**:
  - Create/join clans (up to 50 members)
  - Clan leaderboards (aggregate scores)
  - Clan challenges (team goals)
  - Clan chat and messaging
  - Clan cosmetics (logos, banners, colors)

### 10.3 Phase 3 (Month 7-9)

#### Multiplayer Features (Asynchronous & Co-op)
- **Ghost Runs**:
  - Race against friends' recorded gameplay
  - See their "ghost" character in real-time during mission
  - Compare performance (kills, time, accuracy)
  - Challenge friends to beat your run

- **Cooperative Contracts** (2-player):
  - Special co-op missions requiring teamwork
  - Roles: Sniper (long-range support) + Operative (close-quarters)
  - Split objectives (one player distracts, other infiltrates)
  - Shared rewards and leaderboards
  - Voice chat or quick commands
  - Cross-platform (desktop + mobile simplified controls)

- **PvP Arena** (Experimental):
  - Small-scale tactical 1v1 or 2v2 matches
  - Objective-based (capture point, assassination target)
  - Ranked matchmaking
  - Separate balance from main game

### 10.4 Phase 4 (Month 10-12)

#### Advanced Systems
- **Campaign Story Mode**:
  - 25-mission narrative-driven campaign
  - Cinematic cutscenes (in-engine or pre-rendered)
  - Character development (protagonist backstory)
  - Branching paths based on player choices
  - Multiple endings (3-4 different outcomes)
  - Voice acting for main characters

- **Prestige System**:
  - Reset progression for permanent bonuses after max level (50)
  - Keep cosmetics and premium items
  - Prestige levels (1-10)
  - Each prestige grants:
    - Permanent stat boost (+5% XP, +3% accuracy, etc.)
    - Exclusive prestige weapon skins
    - Prestige icon/badge
  - Prestige-only missions (extreme difficulty, unique challenges)

- **Custom Mission Editor** (Desktop/Advanced):
  - Drag-and-drop level designer using modular pieces
  - Place enemies, objectives, spawn points
  - Set mission parameters (time limits, objectives, difficulty)
  - Share custom missions with community
  - Browse and play community missions
  - Rating system and featured missions
  - Steam Workshop integration (if desktop port exists)

### 10.5 Platform Expansion

#### Desktop Application (Standalone Client)
- **Steam/Epic Games Store/itch.io Release**:
  - Full offline mode
  - Enhanced graphics (higher poly models, better textures, ray tracing via WebGPU)
  - Higher frame rates (120+ FPS support)
  - Ultrawide monitor support (21:9, 32:9)
  - Full mod support
  - Achievements integration (Steam achievements, Xbox achievements)
  - Cloud saves (Steam Cloud, Epic Cloud)

- **Additional Features**:
  - VR mode (experimental, sniper scope focus)
  - Advanced graphics settings (ray-traced shadows, DLSS/FSR upscaling)
  - Uncapped settings (no web performance limits)

#### Mobile Native Apps (iOS/Android)
- **Native Mobile Port**:
  - Optimized 3D renderer for mobile GPUs
  - Touch-optimized UI and controls
  - Gyroscope aiming option
  - Smaller download size (<150 MB initial, streamed content)
  - Offline play for story missions
  - Cross-save with web version

- **Mobile-Exclusive Features**:
  - Push notifications (daily challenges, events)
  - Quick-play mode (bite-sized 3-5 minute missions)
  - Simplified graphics settings (auto-adjust for device)
  - Haptic feedback (iOS, high-end Android)

### 10.6 Content Expansions (DLC/Free Updates)

#### New Environments
1. **Urban Underground** (DLC/Free):
   - Subway tunnels, sewer systems, maintenance corridors
   - Claustrophobic close-quarters combat
   - Limited lighting, flashlight required
   - Verticality via maintenance shafts

2. **Naval Operations** (DLC):
   - Aircraft carrier deck and interior
   - Cargo ships in stormy seas
   - Oil rigs with multiple platforms
   - Moving platforms, dynamic waves

3. **Cyberpunk Megacity** (DLC):
   - Futuristic neon-lit skyscrapers
   - Flying vehicles, holograms
   - High-tech enemies (drones, robots)
   - Unique weapons (energy weapons, EMP grenades)

4. **Historical Missions** (Free Update):
   - WWII-themed operations (D-Day, Berlin)
   - Cold War espionage missions
   - Period-accurate weapons and uniforms
   - Black-and-white film grain visual filter option

#### Special Events (Seasonal)
- **Halloween Event**:
  - Zombie survival mode (non-canon)
  - Spooky cosmetics (skeleton masks, pumpkin helmets)
  - Limited-time weapons (flare gun, chainsaw)
  - Event currency and exclusive shop

- **Winter Event**:
  - Snow-themed maps
  - Holiday cosmetics (Santa outfit, elf gear)
  - Snowball fight mode (fun, non-canon)
  - Winter camo weapon skins

- **Crossover Events**:
  - Collaborate with other indie games
  - Special themed missions (e.g., sci-fi, fantasy)
  - Guest character skins

### 10.7 Social and Community Features

#### Community Tools
- **Replay System** (Enhanced):
  - Save and share full mission replays
  - Free camera spectator mode
  - Slow-motion and speed controls
  - Auto-generated highlight reels (best kills, close calls)
  - Upload to community gallery

- **Screenshot/Clip Sharing**:
  - In-game photo mode (filters, poses, UI toggle)
  - Video capture (last 30 seconds, full mission)
  - Direct share to social media (Twitter, Reddit, Discord)
  - Community gallery with ratings and comments

- **Tournament System**:
  - Official monthly tournaments (open entry)
  - Community-run competitions (tools provided)
  - Prize pools (cosmetics, premium currency, real prizes for major events)
  - Spectator mode for live tournaments
  - Bracket system and seeding

### 10.8 Advanced Customization

#### Weapon Smithing System
- **Deep Customization**:
  - Mix and match weapon parts (barrel, stock, receiver, magazine)
  - Each part affects stats (visual + functional)
  - Paint individual parts with different colors/camos
  - Add stickers and decals
  - Name your custom weapons
  - Share loadouts with community (import/export codes)

#### Player Hideout/Hub
- **3D Personal Space**:
  - Customizable hideout (safehouse theme)
  - Weapon rack displaying owned weapons (3D models)
  - Trophy room showing achievements and awards
  - Shooting range for testing
  - NPCs:
    - Quartermaster (shop)
    - Intelligence Officer (mission briefings)
    - Trainer (tutorials, challenges)
  - Decorations and furniture (unlock via achievements)
  - Friends can visit your hideout (future online feature)

### 10.9 Accessibility Expansion

- **Full Voice Acting**: All dialogue and tutorials fully voiced
- **Screen Reader Support**: Complete UI narration for visually impaired
- **One-Handed Controls**: Pre-configured layouts for left or right hand only
- **Eye-Tracking Support**: Gaze-based aiming for players with limited mobility (requires hardware)
- **Auto-Play Mode**: AI assists with aiming and shooting for cognitive accessibility
- **Dyslexia-Friendly Font**: Optional OpenDyslexic font for all text
- **Photosensitivity Mode**: Reduce/remove flashing lights and effects

### 10.10 Long-Term Vision (Year 2+)

#### Live Service Evolution
- **Seasonal Battle Passes** (Free + Premium):
  - 100 tiers of rewards
  - Free track: Coins, basic cosmetics, XP boosts
  - Premium track ($5-10): Exclusive skins, weapons, emotes, effects
  - Season length: 10-12 weeks
  - Seasonal themes and events

- **Ongoing Content Cadence**:
  - New mission every 3-4 weeks
  - New weapon/attachment every 2 weeks
  - Balance patches monthly
  - Seasonal events quarterly
  - Major content drop (new mode, big expansion) every 6 months

#### Expanded Universe
- **Spin-Off Modes**:
  - **Top-Down Tactical Mode**: Bird's-eye view, XCOM-style turn-based
  - **Puzzle Sniper Challenges**: Physics-based trick shots, Rube Goldberg setups
  - **Horde Mode**: Survive zombie/robot waves with friends
  - **Battle Royale Lite**: 10-player, compact map, last one standing

- **Transmedia Content**:
  - **Comic Series**: Digital comics expanding lore
  - **Animated Shorts**: YouTube series showing character backstories
  - **Novelization**: Official novel series
  - **Soundtrack Release**: Full OST on Spotify/Bandcamp
  - **Art Book**: Digital/print art book with concept art and dev insights

---

## Appendix

### A. Competitive Analysis

**3D Tactical Shooters (Reference)**:
- **Splinter Cell (Simplified)**: Stealth mechanics, cover system inspiration
- **Metal Gear Solid V**: Open approach missions, stealth vs. assault choice
- **Sniper Elite**: Bullet physics, precision shooting, x-ray kill cams
- **PUBG Mobile**: 3D shooter performance on mobile/web
- **Krunker.io**: Fast-paced web-based 3D shooter, performance benchmarking

**Johnny Sniper (Original Inspiration)**:
- Strengths: Accessible, quick sessions, clear visual feedback
- Adaptation: Bring simplicity to 3D, maintain approachability
- Our Advantage: Full 3D immersion, deeper mechanics, AAA-lite presentation

**Market Position**:
- Target: Between casual web games and full PC/console shooters
- Unique: High-quality 3D tactical shooter playable in browser, free-to-play
- Accessibility: No download, no install, play anywhere with web browser

### B. Technical Dependencies

**Game Engine Options**:
1. **Three.js** (Lightweight, flexible)
   - Pros: Full control, widely used, excellent documentation
   - Cons: Build everything from scratch (physics, input, UI)

2. **Babylon.js** (Game-focused)
   - Pros: Built for games, physics integrated, great tooling, active community
   - Cons: Slightly heavier than Three.js
   - **Recommended for this project**

3. **PlayCanvas** (Web-native engine)
   - Pros: Full engine with editor, optimized for web, visual scripting
   - Cons: Closed-source editor (open runtime), learning curve

**Libraries/Frameworks**:
- **Babylon.js 6.0+** (Rendering engine)
- **Cannon.js** or **Ammo.js** (Physics engine)
- **Howler.js 2.0+** (Audio engine with 3D spatial audio)
- **Recast Navigation** (NavMesh pathfinding, JavaScript port)
- **Tween.js** (Animation tweening)
- **Socket.io** (Multiplayer real-time communication)
- **React or Vue.js** (UI framework for menus)

**Development Tools**:
- **Blender 3.6+** (3D modeling, rigging, animation)
- **Substance Painter** (Texture painting, PBR materials)
- **Adobe Photoshop/GIMP** (2D textures, UI graphics)
- **Audacity/Reaper** (Audio editing and mixing)
- **Visual Studio Code** (Code editor, TypeScript/JavaScript)
- **Git/GitHub** (Version control)
- **Webpack/Vite** (Build tools and bundling)

**Backend/Services** (for online features):
- **Node.js + Express** (Backend API)
- **MongoDB or PostgreSQL** (Database for user data, leaderboards)
- **Redis** (Caching, session management)
- **AWS S3 / Cloudflare R2** (Asset CDN hosting)
- **Firebase Authentication** (User accounts, optional)
- **PlayFab / GameSparks** (Backend-as-a-Service alternative)

### C. Testing Requirements

**Quality Assurance**:
- **Browser Compatibility**: Test on all target browsers and versions
- **Device Testing**: Range of hardware (high-end, mid-range, low-end, integrated graphics)
- **Performance Profiling**: FPS, memory usage, load times across configs
- **Playtesting**: At least 50 external playtesters for balance and difficulty
- **Accessibility Testing**: WCAG compliance, colorblind simulation, screen reader testing
- **Security Testing**: Penetration testing, save file integrity, anti-cheat validation
- **Localization Testing**: Ensure all languages display correctly, no text overflow

**Beta Testing Plan**:
- **Closed Alpha** (4 weeks, 100 players):
  - Core mechanics testing
  - First 3 missions
  - Frequent patches based on feedback

- **Open Beta** (6 weeks, unlimited):
  - Full game content (12 missions, all weapons)
  - Stress test servers (leaderboards, multiplayer)
  - Community feedback integration
  - Final balance tweaks

- **Pre-Launch** (1 week):
  - Final bug fixes
  - Performance optimization pass
  - Marketing content creation (trailer, screenshots)

### D. Launch Checklist

**Pre-Launch (Technical)**:
- [ ] All 12 base missions fully playable and polished
- [ ] 15+ weapons implemented and balanced
- [ ] All 3D assets optimized (models, textures, animations)
- [ ] Shop and progression systems functional and tested
- [ ] Tutorial complete and user-tested
- [ ] Performance targets met (60 FPS desktop, 30 FPS mobile)
- [ ] All audio assets implemented and mixed
- [ ] Analytics and telemetry integrated
- [ ] Save system (local + cloud) tested
- [ ] Leaderboards functional
- [ ] Privacy policy, ToS, GDPR compliance
- [ ] Accessibility features implemented and tested
- [ ] Security measures in place (anti-cheat, encryption)
- [ ] Cross-browser testing completed
- [ ] Mobile version functional (if launching simultaneously)

**Pre-Launch (Content & Marketing)**:
- [ ] Gameplay trailer (90-120 seconds, highlights 3D graphics and gameplay)
- [ ] Screenshots (at least 20 high-quality)
- [ ] GIFs and short clips for social media
- [ ] Press kit (EPK with assets, fact sheet, team bios)
- [ ] Website/landing page (game info, screenshots, trailer)
- [ ] Social media accounts (Twitter, Reddit, Discord, TikTok)
- [ ] Influencer outreach (send preview builds to YouTubers, streamers)
- [ ] Press release drafted
- [ ] Community Discord server set up
- [ ] Blog/Dev diary posts (build hype, behind-the-scenes)

**Launch Day**:
- [ ] Deploy to web hosting (high availability, CDN)
- [ ] Monitor server performance and analytics
- [ ] Active on social media (respond to feedback)
- [ ] Community manager ready for Discord/Reddit
- [ ] Hotfix team on standby for critical bugs

**Post-Launch (First Week)**:
- [ ] Monitor analytics (player retention, completion rates, popular features)
- [ ] Gather player feedback (surveys, Reddit, Discord)
- [ ] Hotfix critical bugs within 24-48 hours
- [ ] Address balance issues (weapon tuning, difficulty adjustments)
- [ ] First content update teaser (hype for Phase 1)
- [ ] Thank-you message to community
- [ ] Post-launch retrospective (team meeting on what went well/wrong)

**Post-Launch (First Month)**:
- [ ] Major patch 1.1 (bug fixes, QoL improvements, balance)
- [ ] First content drop (new weapons, mission, or cosmetics)
- [ ] Community event (tournament, challenge mode)
- [ ] Begin work on Phase 1 roadmap content
- [ ] Monetization optimization (A/B test shop layouts, pricing)
- [ ] Expand marketing (paid ads if budget allows, more influencer partnerships)

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 8, 2025 | Initial 2D PRD creation | Game Dev Team |
| 2.0 | Nov 8, 2025 | Complete conversion to 3D game with updated mechanics, graphics, technical requirements, and expanded features | Game Dev Team |

---

**End of Document**

This PRD is a living document and will be updated as the project evolves based on playtesting, technical constraints, community feedback, and technological advancements in web-based 3D gaming.

---

## Summary of Major 3D Changes

**Core Gameplay**:
- Third-person 3D camera system with multiple view modes
- Full 360° movement and aiming in 3D space
- Realistic bullet physics with drop and travel time
- 3D cover system with dynamic positioning
- Verticality (climbing, multiple floors, elevation advantages)

**Visuals**:
- WebGL 2.0 rendering with PBR materials
- Real-time lighting and shadows
- 3D character models (15K-20K polygons)
- 3D environments with LOD system
- Particle effects and post-processing

**Technical**:
- 3D game engine (Babylon.js recommended)
- Physics engine integration
- NavMesh AI pathfinding
- 3D spatial audio
- Significantly larger asset budget (50MB initial, 300MB total)

**Performance**:
- Target: 60 FPS on desktop, 30 FPS on mobile
- Scalable graphics settings (Low to Ultra)
- Advanced optimization strategies for web deployment

**Features**:
- 3D weapon inspection and customization
- Hideout/hub world
- Enhanced cosmetics (full 3D character customization)
- VR mode potential (future)

This transformation elevates the game from a 2D side-scroller to a full 3D tactical shooter while maintaining the accessibility and browser-based nature of the original concept.
