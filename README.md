# TODO

- [] game object params (hp, impact/project power)
  - [x] rock
  - [] ship
  - [] projectile
  - [] player
- [] items
- [] {bug} if a ship is destroyed, its projectiles vanish (the projectiles should live by themselves)
- [] {pending} game objects movement patterns (verify feasibility) - arc, 8, drone, pursuer...
- [] {pending} fix level manager step function

# ALL

- [] assets
  - [x] player
  - [x] enemies
  - [x] items
  - [] projectiles
  - [] fonts (Orbitron)
  - [] effects and animations (e.g. hit/collision effect)\*
  - [] sound (ost, ui)\*
- [] asset loader
  - [x] image
  - [] audio
- [x] level manager
- [] enemies
  - [x] rock
  - [x] ship (see TODO)
  - [] bosses\*
- [] mechanics

  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [] game object params (hp, impact/project power)
  - [] player items
    - [] spawn (drop when an enemy is killed)
    - [] effects (collision event)

- [] HUD
- [] gamepad
- [] UI
- [] background (dynamic, with particles, reacting to the bg music)\*
- [] handle resize on game objects (Projectile, Ship, Rock, Player...)
- [] overall status: time? score? enemies killed? shots fired?`\*

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
