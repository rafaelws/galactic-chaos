import { Menu } from "./Menu";

export function GameEndMenu() {
  return (
    <Menu id="game-end-menu">
      <p class="main-text">thanks for playing</p>
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
