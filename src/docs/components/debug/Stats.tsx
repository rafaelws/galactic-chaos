export function Stats({ title }: { title: string }) {
  return (
    <div className="stats">
      <span>{title}</span>
      <span>
        <span>
          <span id="fps">0</span>fps
        </span>
        <span> | </span>
        <span>
          <span id="frameTime">0</span>ms
        </span>
      </span>
    </div>
  );
}
