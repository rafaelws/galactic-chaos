import "./styles.css";

import { createSignal, For, Show } from "solid-js";

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
  onUpdate?: (params: MovementParams) => void;
}

export function StepManager(params: StepManagerParams) {
  const steps: MovementStep[] = [emptyStep()];
  const [slots, setSlots] = createSignal([undefined]);

  const [activeIx, setActiveIx] = createSignal(0);
  const [repeatable, setRepeatable] = createSignal(true);

  function dispatchUpdate(steps: MovementStep[]) {
    if (params.onUpdate) params.onUpdate({ steps, repeatable: repeatable() });
  }

  function onUpdate(partial: Partial<MovementStep>, ix: number) {
    const step = { ...steps[ix], ...partial };
    steps[ix] = step;
    dispatchUpdate(steps);
  }

  function addStep() {
    let next = activeIx() + 1;
    next = next > steps.length ? steps.length : next;
    setSlots((prev) => {
      prev.splice(next, 0, undefined);
      return [...prev];
    });
    steps.splice(next, 0, emptyStep());
    dispatchUpdate(steps);
    setActiveIx(next);
  }

  function removeStep() {
    const ix = activeIx();
    setSlots((prev) => {
      prev.splice(ix, 1);
      return [...prev];
    });
    steps.splice(ix, 1);
    dispatchUpdate(steps);
    setActiveIx(ix - 1 < 0 ? 0 : ix - 1);
  }

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
        <For each={slots()}>
          {(_, ix) => (
            <option value={ix()} selected={activeIx() === ix()}>
              Step {ix() + 1}
            </option>
          )}
        </For>
      </select>
      <For each={slots()}>
        {(_, ix) => (
          <Show when={activeIx() === ix()}>
            <Movement
              step={steps[ix()]}
              onUpdate={(step) => onUpdate(step, ix())}
            />
          </Show>
        )}
      </For>

      <Show when={slots().length > 1}>
        <button class="common" onClick={removeStep}>
          Remove step
        </button>
      </Show>
    </div>
  );
}
