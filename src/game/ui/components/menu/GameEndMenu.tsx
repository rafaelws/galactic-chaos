import { Menu } from "./Menu";

export function GameEndMenu() {
  return (
    <Menu id="game-end-menu">
      <p class="main-text">thanks for playing</p>
      <p class="hint-text">
        &lt;q&gt; or &lt;start&gt; to restart
        <br />
        &lt;e&gt; or &lt;select&gt; to quit
      </p>
    </Menu>
  );
}
