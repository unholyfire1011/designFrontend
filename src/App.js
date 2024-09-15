import { useSnapshot } from "valtio";
import state from "./store/index.js";
import ShoeComponent from "./components/ShoeComponent.jsx";
import Shirt from "./components/Shirt.jsx";
import Homepage from "./Page/Homepage.jsx";

function App() {
  const states = useSnapshot(state);
  console.log(states.currentPage);

  return (
    <>
      {states.currentPage === "home" ? <Homepage /> : <></>}
      {states.currentPage === "shoe" ? <ShoeComponent /> : <></>}
      {states.currentPage === "shirt" ? <Shirt /> : <></>}
    </>
  );
}

export default App;
