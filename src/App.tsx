import { Route, Routes } from "react-router-dom";
import { APIProvider } from "./Context/APIProvider";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Standings from "./Components/Standings";
import Drivers from "./Components/Drivers/Drivers";
import DriverInfo from "./Components/DriverInfo/DriverInfo";
import Footer from "./Components/Footer";

function App() {
  return (
    <APIProvider>
      <div className="bg-[#15151E] min-h-screen flex flex-col gap-5 items-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/driver/:driverId" element={<DriverInfo />} />
        </Routes>
        <Footer />
      </div>
    </APIProvider>
  );
}

export default App;
