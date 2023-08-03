import "./index.css";

/* @refresh reload */
import { render } from "solid-js/web";

import { Main } from "./Main";

const root = document.getElementById("root")!;

render(() => <Main />, root);
