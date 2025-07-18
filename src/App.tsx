import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { APIProvider } from "./Context/APIProvider";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Footer from "./Components/Footer";

function App() {
  const [view, setView] = useState("home");
  return (
    <APIProvider>
      <div className="bg-[#15151E] min-h-screen flex flex-col items-center">
        <Navbar setView={setView} />
        <Routes>
          <Route path="/" element={<Home view={view} setView={setView} />} />
        </Routes>
        <Footer setView={setView} />
      </div>
    </APIProvider>
  );
}

export default App;
