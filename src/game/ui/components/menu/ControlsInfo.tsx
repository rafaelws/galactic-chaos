export function ControlsInfo() {
  return (
    <footer id="controls-info">
      <table>
        <tbody>
          <tr>
            <td>CONTROLS</td>
          </tr>
          <tr>
            <td>movement</td>
            <td>
              <kbd>w</kbd>
              <kbd>a</kbd>
              <kbd>s</kbd>
              <kbd>d</kbd>
            </td>
            <td>
              <img class="control-image" src="/img/controls/joy_l.png" />
            </td>
            <td>
              <img class="control-image" src="/img/controls/dpad.png" />
            </td>
          </tr>
          <tr>
            <td>aim</td>
            <td>
              <img class="control-image" src="/img/controls/mouse.png" />
            </td>
            <td>
              <img class="control-image" src="/img/controls/joy_r.png" />
            </td>
          </tr>
          <tr>
            <td>shoot</td>
            <td>
              <img class="control-image" src="/img/controls/mouse_l.png" />
            </td>
            <td>
              <img class="control-image" src="/img/controls/r1.png" />
            </td>
          </tr>
          <tr>
            <td>pause</td>
            <td>
              <kbd>q</kbd>
            </td>
            <td>
              <img class="control-image" src="/img/controls/select.png" />
            </td>
          </tr>
        </tbody>
      </table>
    </footer>
  );
}
