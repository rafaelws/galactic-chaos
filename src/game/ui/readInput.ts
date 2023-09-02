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

  function eachInput({ action, fn, destroyOnHit = true }: TriggerOnInput) {
    const joystickHit = gp.getState()[action]?.active;
    const keyboardHit = km.getState()[action]?.active;
    const hit = joystickHit || keyboardHit;

    if (!hit) return;
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

  const interval = setInterval(() => inputs.forEach(eachInput), intervalTime);

  return { destroy };
}
