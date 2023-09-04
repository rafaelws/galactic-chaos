import { Menu } from "./Menu";

export function GameOverMenu() {
  return (
    <Menu id="game-over-menu">
      <p class="main-text">game over</p>
      <div class="hint giga-hint">
        <p class="line">
          <kbd>q</kbd> or{" "}
          <img class="control-image" src="/img/controls/start.png" /> to restart
        </p>
        <p class="line">
          <kbd>e</kbd> or{" "}
          <img class="control-image" src="/img/controls/select.png" /> to quit
        </p>
      </div>
    </Menu>
  );
}
