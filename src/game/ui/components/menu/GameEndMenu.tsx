import { Menu } from "./Menu";

export function GameEndMenu() {
  return (
    <Menu id="game-end-menu">
      <p class="main-text">thanks for playing</p>
      <div class="hint giga-hint">
        <p class="line">
          <kbd>e</kbd> or{" "}
          <img class="control-image" src="/img/controls/start.png" /> to restart
        </p>
        <p class="line">
          <kbd>q</kbd> or{" "}
          <img class="control-image" src="/img/controls/select.png" /> to quit
        </p>
      </div>
    </Menu>
  );
}
