import { proxy } from "valtio";

const state = proxy({
  currentPage: "home",
  lace: "#ffffff",
  mesh: "#ffffff",
  caps: "#ffffff",
  inner: "#ffffff",
  sole: "#ffffff",
  stripes: "#ffffff",
  band: "#ffffff",
  patch: "#ffffff",
  meshTexture: null,
  shirtColor: "#ffffff",
  shirtTexture: null,
});

export default state;
