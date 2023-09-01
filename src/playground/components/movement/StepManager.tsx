import "./styles.css";

import { createSignal, Show } from "solid-js";

import {
  MovementNature,
  MovementParams,
  MovementStep,
} from "@/core/objects/shared/movement/MovementParams";

import { Checkbox } from "..";
import { Movement } from "./Movement";

const emptyStep = () => ({
  nature: MovementNature.Linear,
  p0: { x: 0, y: 0 },
  p1: { x: 1, y: 1 },
  speed: 1,
});

interface StepManagerParams {
  onUpdate: (params: MovementParams) => void;
}

export function StepManager(params: StepManagerParams) {
  const steps: MovementStep[] = [emptyStep()];
  const [slots, setSlots] = createSignal([undefined]);
  const [activeIx, setActiveIx] = createSignal(0);
  const [repeatable, setRepeatable] = createSignal(true);

  function addStep() {
    let next = activeIx() + 1;
    next = next > steps.length ? steps.length : next;
    steps.splice(next, 0, emptyStep());
    setSlots((prev) => {
      // order does not matter here
      prev.push(undefined);
      return [...prev];
    });
    setActiveIx(next);
  }

  function removeStep() {
    const ix = activeIx();
    steps.splice(ix, 1);
    setSlots((prev) => {
      // order does not matter here
      prev.pop();
      return [...prev];
    });
    setActiveIx(ix - 1 < 0 ? 0 : ix - 1);
  }

  // (!) should always notify on update
  function updateStep(step: Partial<MovementStep>, ix: number) {
    steps[ix] = { ...steps[ix], ...step };

    params.onUpdate({
      steps,
      repeatable: repeatable(),
    });
  }

  const isActiveIx = (ix: number) => activeIx() === ix;

  return (
    <div class="movement-step-manager">
      <Checkbox
        id="repeatable"
        label="Repeatable"
        checked={repeatable()}
        onChange={setRepeatable}
      />

      <button class="common" onClick={addStep}>
        Add Step
      </button>

      <select onChange={(ev) => setActiveIx(Number(ev.currentTarget.value))}>
        {slots().map((_, ix) => (
          <option value={ix} selected={isActiveIx(ix)}>
            Step {ix + 1}
          </option>
        ))}
      </select>

      {slots().map((_, ix) => (
        <Show when={isActiveIx(ix)}>
          <Movement
            step={steps[ix]}
            onUpdate={(step) => updateStep(step, ix)}
          />
        </Show>
      ))}

      <Show when={slots().length > 1}>
        <button class="common" onClick={removeStep}>
          Remove step
        </button>
      </Show>
    </div>
  );
}
