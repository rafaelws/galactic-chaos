import { styled } from "@/docs/stiches.config";

const Container = styled("div", {
  display: "flex",
  justifyContent: "space-evenly",
});

export function Stats() {
  return (
    <Container>
      <span>
        <span id="fps">0</span> fps
      </span>
      <span>|</span>
      <span>
        <span id="frameTime">0</span> ms
      </span>
    </Container>
  );
}
