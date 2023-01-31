# NEXT (>doing)

- [ ] {feature} bosses
- [ ] bloom effect on projectiles
- [ ] search for similar games (reference)
- [ ] look for svg copyleft/cc0 assets

# TODO

- [ ] enemies
  - [ ] bosses
- [ ] UI
- [ ] HUD
- [ ] gamepad
- [ ] {asset loader} audio
- [ ] level design
- [ ] assets

  - [ ] effects and animations (e.g. hit/collision effect)
  - [ ] audio: ost, ui
  - [ ] image: projectiles
  - [ ] fonts: ui, hud (Orbitron)

- [ ] handle screen resize on game objects
- [ ] background: dynamic, with particles, reacting to the bg music
- [ ] {low}overall status: time? score? enemies killed? shots fired?` (use LevelManager)
- [ ] {low}{idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
- [ ] {low}{refac} projectile

  - [ ] ability to change speed
  - [ ] appearance

- [ ] {low}{idea} ship: add 2 movement patterns ship movement (using sin, cos)
- [ ] {low}{idea} canon / beam struggle (time event)
- [ ] {low}{idea} syntax sugar: enemy profiles

# DONE

- [ ] player items
  - [x] hp
  - [ ] shield
  - [ ] special
  - [x] spawn items using event
- [x] {assets} images: player, enemies, items
- [x] {asset loader} image
- [x] level manager
- [x] enemies
  - [x] rock
  - [x] ship
- [x] mechanics

  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [x] game object params (hp, impact{power,resistance,collisionTimeout}, projectile{impact{power}})
    - [x] rock
    - [x] ship
    - [x] projectile
    - [x] player
  - [x] overlap damage image when hp is depleated (player)

- [x] refac1 (maintainability iteration)

  - [x] clock utility
  - [x] can a class called GameObject be created to simplify some stuff?
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

---

```
Events:
 - [ ] quit
 - [ ] pause
 - [ ] gameend
 - [ ] gameover
 - [x] spawnEnemyProjectile
 - [ ] spwanPlayerItem
 -
```

```
Gamepad Cheatsheet:

left analog stick
- axes[0]: negative: left, positive: right (horizontal)
- axes[1]: negative: up, positive: down (vertical)

right analog stick
- axes[2]: negative: left, positive: right (horizontal)
- axes[3]: negative: up, positive: down (vertical)

A / xis:       buttons[0]
B / circulo:   buttons[1]
X / quadrado:  buttons[2]
Y / triangulo: buttons[3]

LB / L1:       buttons[4]
RB / R1:       buttons[5]
LT / L2:       buttons[6]
RT / R2:       buttons[7]

SELECT:        buttons[8]
START:         buttons[9]

L axes click:  buttons[10]
R axes click:  buttons[11]
d_up:          buttons[12]
d_down:        buttons[13]
d_left:        buttons[14]
d_right:       buttons[15]
x/ps (joker):  buttons[16]
```

```
// TODO
function requestFullscreen() {
  const vendors = [
    "requestFullscreen",
    "requestFullScreen",
    "mozRequestFullScreen",
    "webkitRequestFullScreen",
    "msRequestFullscreen",
  ];
  const root = document.querySelector("#root")!;
  const method = vendors.find((name) => name in root);
  if (method) (root as HTMLElement)[method]();
}

```

```
NOTES for the exp.share/'post mortem':

- not ideal design choices
  - inheritance caveats
  - "why haven't you used an engine?"
  - ended rushing some features (e.g. items, player damage)
  - approach: let the idea out, struggle, make it work, struggle a bit more, refactor
- math, trigonometry
```
