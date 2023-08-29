import { Config, ConfigInputType, ConfigKey } from "@/core";
import {
  ControlAction,
  InputHandler,
  Joystick,
  KeyboardAndMouse,
} from "@/core/controls";
import { Destroyable } from "@/core/meta";

export type TriggerOnInput = {
  action: ControlAction;
  fn: () => void;
  destroyOnHit?: boolean;
};

export function readInput(inputs: TriggerOnInput[]): Destroyable {
  const intervalTime = 50; // works better for gamepad
  const km: InputHandler = new KeyboardAndMouse();
  const gp: InputHandler = new Joystick();

  function destroy() {
    km.destroy();
    gp.destroy();
    clearInterval(interval);
  }

  const interval = setInterval(() => {
    inputs.forEach(({ action, fn, destroyOnHit = true }) => {
      const joystickHit = gp.getState()[action]?.active;
      const keyboardHit = km.getState()[action]?.active;
      const hit = joystickHit || keyboardHit;

      if (hit) {
        if (destroyOnHit) {
          Config.set(
            ConfigKey.Input,
            joystickHit
              ? ConfigInputType.Joystick
              : ConfigInputType.KeyboardAndMouse
          );
          destroy();
        }
        fn();
      }
    });
  }, intervalTime);

  return { destroy };
}