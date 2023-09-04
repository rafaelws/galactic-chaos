import { Menu } from "./Menu";

export function MainMenu() {
  return (
    <Menu id="main-menu">
      <p class="main-text">galactic chaos</p>
      <p class="hint-text" style="font-size: 2rem;">
        &lt;q&gt; or &lt;start&gt;
      </p>
      <p class="hint-text" style="font-size: 1rem;">
        &lt;e&gt; or &lt;select&gt; to show options
      </p>
    </Menu>
  );
}
