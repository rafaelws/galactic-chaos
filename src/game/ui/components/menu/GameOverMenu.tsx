import { Menu } from "./Menu";

export function GameOverMenu() {
  return (
    <Menu id="game-over-menu">
      <p class="main-text">game over</p>
      <div class="hint giga-hint">
        <p class="line">
          <kbd>e</kbd> or <span class="ctrl">start</span> to restart
        </p>
        <p class="line">
          <kbd>q</kbd> or <span class="ctrl">select</span> to quit
        </p>
      </div>
    </Menu>
  );
}
