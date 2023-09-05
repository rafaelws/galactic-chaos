import { Menu } from "./Menu";

export function PauseMenu() {
  return (
    <Menu id="pause-menu">
      <div class="hint" style="margin-top: -0.25rem">
        <p class="line" style="max-height: 2rem">
          <kbd>e</kbd> or{" "}
          <img class="control-image" src="/img/controls/start.png" /> to resume
        </p>
        <p class="line" style="max-height: 2rem">
          <kbd>q</kbd> or{" "}
          <img class="control-image" src="/img/controls/select.png" /> to quit
        </p>
      </div>
      <p class="main-text">pause</p>
    </Menu>
  );
}
