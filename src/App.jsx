import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
    </Routes>
  );
}

export default App;