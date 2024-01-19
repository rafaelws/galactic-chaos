import { Menu } from "./Menu";

export function PauseMenu() {
  return (
    <Menu id="pause-menu">
      <div class="hint" style="margin-top: -0.25rem">
        <p class="line" style="max-height: 2rem; margin-bottom: .5rem">
          <kbd>e</kbd> or <span class="ctrl">start</span> to resume
        </p>
        <p class="line" style="max-height: 2rem">
          <kbd>q</kbd> or <span class="ctrl">select</span> to quit
        </p>
      </div>
      <p class="main-text">pause</p>
    </Menu>
  );
}
