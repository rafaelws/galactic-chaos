import { Menu } from "./Menu";

export function GameOverMenu() {
  return (
    <Menu id="game-over-menu">
      <p class="main-text">game over</p>
      <p class="hint-text">
        &lt;q&gt; or &lt;start&gt; to restart
        <br />
        &lt;e&gt; or &lt;select&gt; to quit
      </p>
    </Menu>
  );
}
