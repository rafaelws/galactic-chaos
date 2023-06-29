// interface Props {
//   update: UpdateFn;
// }

import { Range } from "../../range";

export function RockParameters() {
  // const [state, setState] = useState<RockParams>();

  // useEffect(() => () => update({ params: state }), [state]);
  function handleRotation(_: number) {
    //
  }

  return (
    <div>
      <Range label="Rotation" onValue={handleRotation} />
    </div>
  );
}
