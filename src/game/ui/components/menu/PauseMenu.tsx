import { Menu } from "./Menu";

export function PauseMenu() {
  return (
    <Menu id="pause-menu">
      <p class="hint-text">
        &lt;q&gt; or &lt;start&gt; to resume
        <br />
        &lt;e&gt; or &lt;select&gt; to quit
      </p>
      <p class="main-text">pause</p>
    </Menu>
  );
}
