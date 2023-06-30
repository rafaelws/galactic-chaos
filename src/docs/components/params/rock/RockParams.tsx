// interface Props {
//   update: UpdateFn;
// }

import { Slider } from "../..";

export function RockParameters() {
  // const [state, setState] = useState<RockParams>();

  // useEffect(() => () => update({ params: state }), [state]);
  function handleRotation(_: number) {
    //
  }

  return (
    <div>
      <Slider
        value={0}
        min={-360}
        max={360}
        step={1}
        label="Rotation (deg)"
        onValue={handleRotation}
      />
    </div>
  );
}
