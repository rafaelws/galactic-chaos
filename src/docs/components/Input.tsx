type Props = React.ComponentProps<"input">;

export function Input(props: Props) {
  return <input className={"colors common " + props.className} {...props} />;
}
