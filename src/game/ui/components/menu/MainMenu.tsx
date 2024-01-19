import { Menu } from "./Menu";

export function MainMenu() {
  return (
    <Menu id="main-menu">
      <p class="main-text">galactic chaos</p>
      <div class="hint giga-hint">
        <p class="line">
          <kbd>e</kbd> or <span class="ctrl">start</span>
        </p>
        <p class="line">
          <kbd>q</kbd> or <span class="ctrl">select</span> to show options
        </p>
      </div>
    </Menu>
  );
}
