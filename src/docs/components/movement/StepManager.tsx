import "./styles.css";

import { createSignal, For, Show } from "solid-js";

import {
  MovementNature,
  MovementStep,
} from "@/core/objects/shared/movement/MovementParams";

import { Checkbox } from "..";
import { Movement } from "./Movement";

const emptyStep = {
  nature: MovementNature.Linear,
  p0: { x: 0, y: 0 },
  p1: { x: 1, y: 1 },
  speed: 1,
};

export function StepManager() {
  const [steps, setSteps] = createSignal<MovementStep[]>([emptyStep]);
  const [repeatable, setRepeatable] = createSignal<boolean>(false);

  const [activeIx, setActiveIx] = createSignal(0);

  const isActive = (ix: number) => activeIx() === ix;
  let currentStep: MovementStep | null = null;

  function onUpdate(step: MovementStep) {
    currentStep = step;
    // TODO send upstream
  }

  function changeActive(ix: number) {
    if (currentStep)
      setSteps((prev) => {
        prev[activeIx()] = currentStep!;
        return [...prev];
      });

    setActiveIx(ix);
  }

  function addStep() {
    setSteps((prev) => {
      if (currentStep) prev[activeIx()] = currentStep;
      const nextIx = activeIx() + 1;
      prev.splice(nextIx > prev.length ? prev.length : nextIx, 0, {
        ...emptyStep,
      });
      setActiveIx(nextIx);
      return [...prev];
    });
  }

  function removeStep(ix: number) {
    setSteps((prev) => {
      prev.splice(ix, 1);
      const prevIx = ix - 1;
      setActiveIx(prevIx < 0 ? 0 : prevIx);
      return [...prev];
    });
  }

  return (
    <div class="movement-step-manager">
      <Checkbox
        id="repeatable"
        label="Repeatable"
        checked={repeatable()}
        onChange={(value) => setRepeatable(value)}
      />
      <button class="common" onClick={addStep}>
        Add Step
      </button>
      <select onChange={(ev) => changeActive(Number(ev.currentTarget.value))}>
        <For each={steps()}>
          {(_, ix) => (
            <option value={ix()} selected={isActive(ix())}>
              Step {ix() + 1}
            </option>
          )}
        </For>
      </select>
      <For each={steps()}>
        {(step, ix) => (
          <Show when={isActive(ix())}>
            <Movement step={step} onUpdate={onUpdate} />
            <Show when={steps().length > 1}>
              <button class="common" onClick={() => removeStep(ix())}>
                Remove step
              </button>
            </Show>
          </Show>
        )}
      </For>
    </div>
  );
}
