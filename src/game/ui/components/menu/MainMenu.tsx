import { Menu } from "./Menu";

export function MainMenu() {
  return (
    <Menu id="main-menu">
      <p class="main-text">galactic chaos</p>
      <div class="hint giga-hint">
        <p class="line">
          <kbd>e</kbd> or{" "}
          <img class="control-image" src="/img/controls/start.png" />
        </p>
        <p class="line">
          <kbd>q</kbd> or{" "}
          <img class="control-image" src="/img/controls/select.png" /> to show
          options
        </p>
      </div>
    </Menu>
  );
}
