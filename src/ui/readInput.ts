import {
  ControlAction,
  InputHandler,
  Joystick,
  KeyboardAndMouse,
  PreferredInput,
} from "@/common/controls";

export type TriggerOnInput = {
  action: ControlAction;
  fn: () => void;
};

export function readInput(inputs: TriggerOnInput[]) {
  const intervalTime = 50; // works better for gamepad
  const km: InputHandler = new KeyboardAndMouse();
  const gp: InputHandler = new Joystick();

  const interval = setInterval(() => {
    inputs.forEach((input) => {
      const joystickHit = gp.getState()[input.action]?.active;
      const keyboardHit = km.getState()[input.action]?.active;
      const hit = joystickHit || keyboardHit;

      if (hit) {
        sessionStorage.setItem(
          PreferredInput.Id,
          joystickHit
            ? PreferredInput.Joystick
            : PreferredInput.KeyboardAndMouse
        );
        km.destroy();
        gp.destroy();
        clearInterval(interval);
        input.fn();
      }
    });
  }, intervalTime);
}
