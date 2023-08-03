import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  const [split] = splitProps(props, ["class"]);
  return <input class={"colors common " + (split.class || "")} {...props} />;
}
