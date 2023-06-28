import { memo } from "react";

import { styled } from "@/docs/stiches.config";

export type StatsData = {
  fps: string;
  frameTime: string;
};

interface Props {
  stats: StatsData;
}

const Container = styled("div", {
  display: "flex",
  justifyContent: "space-evenly",
});

export const Stats = memo(({ stats }: Props) => {
  return (
    <Container>
      <span>{stats.fps} fps</span>
      <span>|</span>
      <span>{stats.frameTime} ms</span>
    </Container>
  );
});
