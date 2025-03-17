import { Route, Routes } from "react-router-dom";
import { APIProvider } from "./Context/APIProvider";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Standings from "./Components/Standings";
import DriverInfo from "./Components/DriverInfo";

function App() {
  return (
    <APIProvider>
      <div className="bg-gray-900 min-h-screen flex flex-col gap-2 items-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/driver" element={<DriverInfo />} />
        </Routes>
      </div>
    </APIProvider>
  );
}

export default App;
