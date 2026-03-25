import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import MeetingApp from "./components/MeetingApp";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MeetingApp />
    </>
  );
}

export default App;
