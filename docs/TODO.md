# TODO 

## Assets
- [x] audio loading
  - [x] do not preload (only load on demand)
  - [x] {bug} fix overlapping audio problem
- [ ] image loading
  - [ ] use inline svg for controls
  - [ ] use svg for game assets (consider using an atlas/"spritesheet")

## misc

- [ ] check build sizes and optimize if necessary (code, save bandwidth)
- [ ] add a song and "level cleared" message to the game end
- [ ] release
  - [x] blog / website
  - [x] game post (solidjs music player)
  - [x] gameplay video
  - [x] playground video
  - [ ] publish 
- [x] switch q/e actions on menus  (q for quit)
- [x] communicate player of controls @ menus (use `<kbd>`)
- [x] rewrite game ui with solidjs

# NEXT

## Features
 - [x] playground
 - [ ] level designer

## To Consider
 - [ ] change/simplify mechanics
 - [ ] make the game and playground mobile friendly

## Fixes/Improvements
 - [ ] handle screen resize on game objects (affects overall dimensions and movement) (use debounce)
 - [ ] remove colors from source code if possible
 - [ ] {?} {bug} menu/options animations/transition (they are not fading-out)
 - [ ] {?} beziers: verify if it is possible to better distribute points
---

# BACKLOG / IDEAS
- [x] create a loading screen between levels (while the assets are being loaded)
- [ ] player 
  - [x] radar
  - [ ] shield (item)
  - [ ] special (item)
- [ ] projectile
  - [x] draw projectiles directly on canvas (do not use asset/image)
  - [ ] {idea} deflect projectile on hit
  - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
  - [ ] {idea} projectile upgrades (size, amount, speed, rate)
  - [ ] {idea} canon / beam struggle (time event)
- [ ] audio
  - [ ] ost (game end)
  - [ ] ui sfx (pause, (re)start)
  - [ ] gameplay sfx (collision, projectile, item)
- [ ] misc
  - [ ] improve: gampead mechanics, hitboxes
  - [ ] overall status (time? score? enemies defeated? projectiles fired?)
  - [ ] make projectile and player movement smoother
  - [ ] use lerp for alpha and movement (Star, ExplosionParticle)
  - [ ] syntax sugar: enemy profiles (code)
  - [ ] request fullscreen (+config option)
  - [x] projectile appearance [performance concearn using filter]
  - [x] fade-in/out menus
  - [x] fade-in/out hud
  - [x] (UI) tooling: consider using an interactive form to showcase/test game objects (see `dat.gui`, `lil-gui`)
  - [ ] use sprites (review canvas performance and load time)
- [ ] (UI) tooling: level designer
- [ ] Gamepad:
  - [ ] PreferredInput: gamepad or keyboard/mouse (choose gamepad index?)
  - [ ] Configuration: controller stick drift (left and right)
  - [ ] if gamepad unplugged/disconnect:
    - A) look for another avaliable gamepad (if none, do A) or
    - B) go back to keyboard/mouse

# DONE

- [x] HUD
- [x] UI
- [x] player items (basics)
  - [x] hp
  - [x] spawn items using event
- [x] assets
  - [x] font (orbitron)
  - [x] loader and images (player, enemies, items...)
  - [x] loader, audio and audio manager
- [x] level manager
- [x] enemies
  - [x] rock
  - [x] ship
  - [x] bosses
- [x] mechanics
  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [x] game object params (hp, spawnTimeout, spawnables, impact{power,resistance,collisionTimeout})
    - [x] rock
    - [x] ship
    - [x] projectile (color, power)
    - [x] player
  - [x] overlap damage image when hp is depleated (player)
  - [x] gamepad
  
- [x] effects

  - [x] animations (e.g. projectile hit/collision effect)
  - [x] background particles

- [x] refac1 (maintainability iteration)

  - [x] clock utility
  - [x] can a class be created to simplify some stuff (GameObject)?
  - [x] can some types/interfaces be shared?
  - [x] {refac} ship (with GameObject and Clock)
  - [x] {refac} rock (with GameObject and Clock)
  - [x] {refac} projectile
  - [x] {refac} player
  - [x] simplify and use Concrete when necessary
  - [x] upload to a remote to prevent data loss

- [x] refac2

  - [x] {refac} Make player a game object (setControls, extends GameObject)
  - [x] {bug} fix Projectile hitbox (palliative)
  - [x] {refac} Use events to spawn enemy projectiles
  - [x] {bug} if a Ship is destroyed, its projectiles vanish (solved by previous item)
  - [x] {bug} fix level manager step function

- [x] radar
---
- [x] {improvement} projectile appearance
- [x] {bug|improvement} gamepad (make it work interchangeably with keyboard/mouse)
  - [x] solution: on ANY menu, the game is notified of the preferred input (palliative)
- [x] {improvement} circle collision calculation (without sqrt)

- [x] New Movement Implementation

  - [x] FluentMovement
  - [x] Boss
  - [x] multiple steps
  - [x] repeatable
  - [x] Rock
  - [x] Ship
  - [x] draw debug lines
  - [x] lerp, quadratic bezier, cubic bezier
  - [x] {bug} fix movement end

- [x] granular debug for game objects
- [x] audio

  - [x] loader
  - [x] manager
  - [x] ost

    - [x] game over (loop)
    - [x] level song (short)
    - [x] boss song (short)
    - [x] main menu (loop)
    - [x] pause (loop)

- [x] configuration

  - [x] settings for: enable audio, audio volume, background density
  - [x] ui configuration on game start
  - [x] ui configuration on pause (always open)
  - [x] fade-in/out options

- [x] level design: first boss
- [x] level design: level 1/first level
- [x] {bug} fix boss movement transition (use alpha)
- [x] {bug} debounce start/select
- [x] {bug} objects with spawnTimeout can't be destroyed before they spawn
- [x] {bug} Joystick disconnected
- [x] update inner game event system (replace browser event system with internal pub/sub solution)
- [x] setup eslint
- [x] disable arrows everywhere (wasd only)
- [x] update menus to use q to pause/unpause (q=START, e=SELECT)
- [x] {bug} audio: track overlap when actions are triggered too close to each other
- [x] {bug} audio overlap (reincident)
- [x] {bug} fix stutter on level change (all assets are being loaded on firstLevel) (added loader)
- [x] *every level should load ALL the assets it will use (level-independent asset loading)
- [x] *trigger "loading state" while a level is loading

- - -

# Playground

## Main
- [x] Ship params component
- [x] {Ship} Fire component
- [x] Rock params component
- [x] communicate the canvas using PubSub
- [x] enable just rock and ship for now (boss for next cycle)
- [x] rename files from docs to playground

## (Playground) Movement Component:
- [x] use nature from MovementParams on Movement.tsx (drop custom Nature type)
- [x] ability to add more `steps`
- [x] input to determine if a movement is globally `repeatable`
- [x] {bug} better highlighting for current point
- [x] input to set movement `speed` (for each `step`)
- [X] {bug} window events
- [x] {bug} include mouse offset while dragging point/circle
- [x] {bug} include circle radius (offset) when calculating min/max
- [x] add 2 sliders to change current point x and y
- [x] use global event for dragging (window -> mousemove, mouseup)
- [x] {bug} fix dragging to stay in bounds
- [x] (svg) [wrapper]
- [x] plot grid
- [x] plot points
- [x] plot lines between points (traced animated showing direction)
- [x] Line Component 
- [x] positions should be relative
- [x] toggle to change movement type: linear, quadratic, cubic
- [x] inputs to track x and y of each point
- [ ] ability to set predefined (center, center left, top left, .15, .25, .333, .5, .666, .75...) and random values (rir)
- [ ] ability to lock a point or step (so the user can't modify it)

## Misc
- [x] review README (add playground)
- [x] remove tooling (husky, lint-staged, cz, commitlint)
- [x] move UI to solidjs
- [x] organize css - set `common` and `colors` to all input
- [x] {refac} rename math methods
- [x] (big) refactor: go back to plain css (remove css-in-js); remove libs:
  - [x] stiches
  - [x] classnames
  - [x] checkbox
  - [x] toggleGroup
  - [x] slider
  - [x] scrollarea