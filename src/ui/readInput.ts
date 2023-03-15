import { Config } from "@/common";
import {
  ControlAction,
  InputHandler,
  Joystick,
  KeyboardAndMouse,
} from "@/common/controls";

export type TriggerOnInput = {
  destroy?: boolean;
  action: ControlAction;
  fn: () => void;
};

export function readInput(inputs: TriggerOnInput[]) {
  const intervalTime = 50; // works better for gamepad
  const km: InputHandler = new KeyboardAndMouse();
  const gp: InputHandler = new Joystick();

  const interval = setInterval(() => {
    inputs.forEach(({ action, fn, destroy = true }) => {
      const joystickHit = gp.getState()[action]?.active;
      const keyboardHit = km.getState()[action]?.active;
      const hit = joystickHit || keyboardHit;

      if (hit) {
        if (destroy) {
          Config.set(
            Config.Key.Input,
            joystickHit ? Config.Input.Joystick : Config.Input.KeyboardAndMouse
          );
          km.destroy();
          gp.destroy();
          clearInterval(interval);
        }
        fn();
      }
    });
  }, intervalTime);
}
