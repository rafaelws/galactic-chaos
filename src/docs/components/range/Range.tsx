import { Container, Handle, HandleContainer, Input } from "./styles";

interface Props {
  label: string;
  onValue: (value: number) => void;
  start?: number;
  min?: number;
  max?: number;
  step?: number;
}

export function Range(props: Props) {
  return (
    <Container>
      {props.label}
      <Input />
      <HandleContainer>
        <Handle />
      </HandleContainer>
    </Container>
  );
}
