const style = {
  display: "flex",
  justifyContent: "space-evenly",
};

export function Stats() {
  return (
    <div style={style}>
      <span>
        <span id="fps">0</span> fps
      </span>
      <span>|</span>
      <span>
        <span id="frameTime">0</span> ms
      </span>
    </div>
  );
}
