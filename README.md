# TODO

- [] game object params (hp, impact{power,resistance,collisionTimeout}, projectile power)
  - [x] rock
  - [x] ship
  - [] projectile
  - [] player
- [] review the utility of LevelManager.ts (see implementation of collisionTimeout on ship/rock impact)
- [] {pending}
- [] {pending} ship movement patterns - arc, 8, sin, cos, pursuer, etc...
- [] {pending|idea} player events from LevelManager.ts, set them directly on Player.ts
- [] {bug} if a ship is destroyed, its projectiles vanish (the projectiles should live by themselves)
- [] {pending} fix level manager step function
- [] player items
- [] boss

# BASIC

- [x] assets
  - [x] images: player, enemies, items
- [x] asset loader
  - [x] image
- [x] level manager
- [x] enemies
  - [x] rock
  - [x] ship (see TODO)
  - [] boss
- [x] mechanics

  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [x] game object params (hp, impact{power,resistance,collisionTimeout}, projectile power)
  - [] level design

# Nice-to-haves

- [] assets

  - [] effects and animations (e.g. hit/collision effect)
  - [] audio: ost, ui
  - [] image: projectiles
  - [] fonts: ui, hud (Orbitron)

- [] asset loader

  - [] audio

- [] player items
  - [] spawn (drop when an enemy is killed)
  - [] effects (collision event)
- [] HUD
- [] gamepad
- [] background (dynamic, with particles, reacting to the bg music)
- [] UI
- [] overall status: time? score? enemies killed? shots fired?`
- [] handle resize on game objects (Projectile, Ship, Rock, Player...)

---

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
