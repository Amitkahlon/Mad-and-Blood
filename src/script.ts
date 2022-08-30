import { Render } from "./render";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const render = new Render(canvas);

const main = (render:Render) => {
  render.init()
}

main(render);
