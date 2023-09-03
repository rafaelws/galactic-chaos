import "./styles.css";

import { JSX } from "solid-js";

interface MenuParams {
  id: string;
  children: JSX.Element;
}

export function Menu(params: MenuParams) {
  return (
    <div id={params.id} class="menu">
      {params.children}
    </div>
  );
}
