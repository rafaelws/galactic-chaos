export const Toggle = (params: { active: boolean }) => (
  <div class="toggle" classList={{ active: params.active }}>
    <div class="handle"></div>
  </div>
);
